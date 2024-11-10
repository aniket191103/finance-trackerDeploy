import { db } from "@/db/drizzle";
import { categories, insertCategorySchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createId } from "@paralleldrive/cuid2"
import { z } from "zod";



const app = new Hono()
  .get('/',
    clerkMiddleware()
    ,
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        return c.json({
          error: "Unauthorized"
        }, 401)
      }

      const data = await db.select({
        id: categories.id,
        name: categories.name,
      }
      ).from(categories).where(eq(categories.userId, auth.userId));
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
            id: categories.id,
            name: categories.name,
          })
          .from(categories)
          .where(
            and(
              eq(categories.userId, auth.userId),
              eq(categories.id, id)
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
    zValidator("json", insertCategorySchema.pick({
      name: true,
    }))

    , async (c) => {
      const auth = getAuth(c);
      const value = c.req.valid("json");


      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const [data] = await db.insert(categories).values({
        id: createId(),
        userId: auth.userId,
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

    const data = await db
      .delete(categories)
      .where(and(eq(categories.userId, auth.userId),
        inArray(categories.id, values.ids))).returning({
          id: categories.id
        })
    return c.json({ data });
  }
  )

  .patch("/:id", clerkMiddleware(), zValidator("param", z.object({
    id: z.string().optional(),
  })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param")
      const value = c.req.valid("json");

      if (!id) {
        return c.json({ error: "Missing id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const [data] = await db.update(categories).set(value).where(and(eq(categories.userId, auth.userId),
        eq(categories.id, id),
      ))
        .returning();


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

      const [data] = await db.delete(categories).where(and(eq(categories.userId, auth.userId),
        eq(categories.id, id),
      ))
        .returning({id:categories.id});


      if (!data) {
        return c.json({ error: "Not Found" }, 404)
      }

      return c.json({ data });
    }
  )



export default app;