import { asc } from "drizzle-orm";
import { router, publicProcedure } from "../trpc";
import { categories } from "@/server/db/schema";

export const categoriesRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.nameFa));
  }),
});
