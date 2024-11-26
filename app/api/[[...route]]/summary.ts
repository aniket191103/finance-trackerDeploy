import { db } from "@/db/drizzle";
import { accounts, categories, transaction } from "@/db/schema";
import { calculatePercentageChange, fillMissingDays } from "@/lib/utils";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()

.get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;

    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {
      return await db
        .select({
          income: sql`SUM(CASE WHEN ${transaction.amount} >= 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(Number),
          expenses: sql`SUM(CASE WHEN ${transaction.amount} < 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(Number),
          remaining: sum(transaction.amount).mapWith(Number),
        })
        .from(transaction)
        .innerJoin(accounts, eq(transaction.accountId, accounts.id))
        .where(
          and(
            accountId ? eq(transaction.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transaction.date, startDate),
            lte(transaction.date, endDate)
          )
        );
    }

    const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate);
    const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd);

    const inComeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
    const expenseChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
    const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transaction.amount}))`.mapWith(Number),
      })
      .from(transaction)
      .innerJoin(accounts, eq(transaction.accountId, accounts.id))
      .innerJoin(categories, eq(transaction.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transaction.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transaction.amount, 0),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate)
        )
      )
      .groupBy(categories.name)
      .orderBy(desc(sql`SUM(ABS(${transaction.amount}))`));

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);

    const otherSum = otherCategories.reduce((sum, current) => sum + current.value, 0);

    const finalCategory = [...topCategories];
    if (otherCategories.length > 0) {
      finalCategory.push({
        name: "Other",
        value: otherSum,
      });
    }

    const activeDays = await db
    .select({
      date: transaction.date,
      income: sql`SUM(CASE WHEN ${transaction.amount} >= 0 THEN ${transaction.amount} ELSE 0 END)`.mapWith(Number),
      expenses: sql`SUM(CASE WHEN ${transaction.amount} < 0 THEN ABS(${transaction.amount}) ELSE 0 END)`.mapWith(Number),
    })
    
      .from(transaction)
      .innerJoin(accounts, eq(transaction.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transaction.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transaction.date, startDate),
          lte(transaction.date, endDate)
        )
      )
      .groupBy(transaction.date)
      .orderBy(transaction.date);



      const days = fillMissingDays(activeDays,startDate,endDate);


    return c.json({


      data:{
        remainingAmount :currentPeriod.remaining,
        remainingChange,
        incomeAmount :currentPeriod.income,
        inComeChange,
        expenseAmount :currentPeriod.expenses,
        expenseChange,
        categories:finalCategory,
        days
      }
    });
  }
);

export default app;
