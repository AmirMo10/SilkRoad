import { z } from "zod";
import { eq, and, desc, asc, or, ilike, gte, lte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { products, categories } from "@/server/db/schema";

const sortOptions = z.enum(["newest", "priceAsc", "priceDesc", "moqAsc"]).default("newest");

export const productsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(24),
          cursor: z.string().uuid().optional(),
          categorySlug: z.string().optional(),
          search: z.string().trim().max(120).optional(),
          minPriceRial: z.bigint().nonnegative().optional(),
          maxPriceRial: z.bigint().nonnegative().optional(),
          sort: sortOptions.optional(),
          activeOnly: z.boolean().default(true),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 24;
      const sort = input?.sort ?? "newest";
      const activeOnly = input?.activeOnly ?? true;

      const conditions = [];
      if (activeOnly) conditions.push(eq(products.isActive, true));

      if (input?.categorySlug) {
        const [cat] = await ctx.db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, input.categorySlug))
          .limit(1);
        if (cat) conditions.push(eq(products.categoryId, cat.id));
        else conditions.push(sql`false`);
      }

      if (input?.search) {
        const like = `%${input.search}%`;
        conditions.push(
          or(
            ilike(products.nameFa, like),
            ilike(products.nameEn, like),
            ilike(products.descriptionFa, like),
            ilike(products.descriptionEn, like),
          )!,
        );
      }

      if (input?.minPriceRial !== undefined) {
        conditions.push(gte(products.wholesalePriceRial, input.minPriceRial));
      }
      if (input?.maxPriceRial !== undefined) {
        conditions.push(lte(products.wholesalePriceRial, input.maxPriceRial));
      }

      const orderBy =
        sort === "priceAsc"
          ? asc(products.wholesalePriceRial)
          : sort === "priceDesc"
            ? desc(products.wholesalePriceRial)
            : sort === "moqAsc"
              ? asc(products.moq)
              : desc(products.createdAt);

      const rows = await ctx.db
        .select()
        .from(products)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit + 1);

      const hasMore = rows.length > limit;
      const items = hasMore ? rows.slice(0, limit) : rows;

      return {
        items,
        nextCursor: hasMore ? items[items.length - 1]?.id : null,
      };
    }),

  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ ctx, input }) => {
    const [product] = await ctx.db
      .select()
      .from(products)
      .where(and(eq(products.slug, input.slug), eq(products.isActive, true)))
      .limit(1);
    if (!product) throw new TRPCError({ code: "NOT_FOUND" });

    const [category] = await ctx.db
      .select()
      .from(categories)
      .where(eq(categories.id, product.categoryId))
      .limit(1);

    return { ...product, category: category ?? null };
  }),

  featured: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(12).default(4) }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.createdAt))
        .limit(input?.limit ?? 4);
    }),
});
