import { db } from "@/db/drizzle";
import { transaction, insertAccountSchema, categories, accounts, insertTransactionSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createId } from "@paralleldrive/cuid2"
import { z } from "zod";
import { addMonths, parse, subDays } from "date-fns"
import { date } from "drizzle-orm/mysql-core";
import { error } from "console";

const app = new Hono()
  .get('/',
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    clerkMiddleware()
    ,
    async (c) => {
      const auth = getAuth(c);
      const { from, to, accountId } = c.req.valid("query")

      if (!auth?.userId) {
        return c.json({
          error: "Unauthorized"
        }, 401)
      }


      const defaultTo = new Date();
      const defaultForm = subDays(defaultTo, 30);

      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultForm;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;


      const data = await db.select({
        id:transaction.id,
        date:transaction.date,
        category:categories.name,
        categoryId:transaction.categoryId,
        payee:transaction.payee,
        amount:transaction.amount,
        notes:transaction.notes,
        account:accounts.name,
        accountId:transaction.accountId
      })
      .from(transaction)
      .innerJoin(accounts,eq(transaction.accountId,accounts.id))
      .leftJoin(categories,eq(transaction.categoryId,categories.id))
      .where(
        and(
          accountId?eq(transaction.accountId,accountId):undefined,
          eq(accounts.userId,auth.userId),
          gte(transaction.date,startDate),
          lte(transaction.date,endDate)
        )
      )
      .orderBy(desc(transaction.date))
      return c.json({ data });
    })
  .get(
    "/:id",
    zValidator("param", z.object({
      id: z.string().optional(),
    })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      // Check if the ID is missing
      if (!id) {
        return c.json({ error: "Missing Id" }, 400);
      }

      // Check if the user is not authenticated
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      try {
        // Fetch data from the database
        const [data] = await db
          .select({
        id:transaction.id,
        date:transaction.date,
        categoryId:transaction.categoryId,
        payee:transaction.payee,
        amount:transaction.amount,
        notes:transaction.notes,
        accountId:transaction.accountId
          })
          .from(transaction)
          .innerJoin(accounts,eq(transaction.accountId,accounts.id))

          .where(
            and(
              eq(transaction.id, id),
              eq(accounts.userId, auth.userId)
            )
          );

        // If no data is found, return a 404 error
        if (!data) {
          return c.json({ error: "Not found" }, 404);
        }

        // Return the fetched data
        return c.json(data);
      } catch (error) {
        // Handle unexpected errors
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

  .post("/",

    clerkMiddleware()
    ,
    zValidator("json", insertTransactionSchema.omit({
      id: true,
    }))

    , async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");


      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const [data] = await db.insert(transaction).values({
        id: createId(),
        ...value,
      }).returning();


      return c.json({});
    })
  .post("/bulk-delete", clerkMiddleware(), zValidator(
    "json",
    z.object({
      ids: z.array(z.string()),
    })
  ), async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "unauthorized" }, 401)
    }



    const transactionToDelete=db.$with("transaction_to_delete").as(
      db.select({
        id:transaction.id
      }).from(transaction)
      .innerJoin(accounts,eq(transaction.accountId,accounts.id))
      .where(and(
        inArray(transaction.id,values.ids),
        eq(accounts.userId,auth.userId),
      ))
    )

    const data = await db
    .with(transactionToDelete)
      .delete(transaction)
      .where(
        inArray(transaction.id,sql`{select id from ${transactionToDelete}}`)
      )
      .returning({
        id:transaction.id,
      })
      
    return c.json({ data });
  }
  )

  .patch("/:id", clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional(),
  })),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param")
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }
      const transactionToUpdate=db.$with("transaction_to_update").as(
        db.select({
          id:transaction.id
        }).from(transaction)
        .innerJoin(accounts,eq(transaction.accountId,accounts.id))
        .where(and(
          eq(transaction.id,id),
          eq(accounts.userId,auth.userId),
        ))
      )
      const [data] = await db.with(transactionToUpdate).
      update(transaction).
      set(values)
      .where(inArray(transaction.id,sql `(select id from ${transactionToUpdate})`
      )).returning()
    

      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }

      return c.json({ data });
    }
  )

  .delete("/:id", clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional(),
  })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param")

      if (!id) {
        return c.json({ error: "Missing id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }
      const transactionToDelete=db.$with("transaction_to_Delete").as(
        db.select({
          id:transaction.id
        }).from(transaction)
        .innerJoin(accounts,eq(transaction.accountId,accounts.id))
        .where(and(
          eq(transaction.id,id),
          eq(accounts.userId,auth.userId),
        ))
      )
      const [data] = await db.
      with(transactionToDelete)
      .delete(transaction)
      .where(
        inArray(
          transaction.id,
          sql `select if rom ${transactionToDelete}`
        )
      )
      .returning({
        id:transaction.id,
      })


      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }

      return c.json({ data });
    }
  )


  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        })
      )
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
       
        const data = await db.insert(transaction).values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        ).returning();
  
        return c.json({ success: true, data });
      } 
    
  );
  

export default app;