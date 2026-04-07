import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { products } from "@/server/db/schema";

export const productsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(20),
          activeOnly: z.boolean().default(true),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const activeOnly = input?.activeOnly ?? true;
      return ctx.db
        .select()
        .from(products)
        .where(activeOnly ? eq(products.isActive, true) : undefined)
        .orderBy(desc(products.createdAt))
        .limit(limit);
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const [product] = await ctx.db
      .select()
      .from(products)
      .where(and(eq(products.slug, input.slug), eq(products.isActive, true)))
      .limit(1);
    if (!product) throw new TRPCError({ code: "NOT_FOUND" });
    return product;
  }),
});
