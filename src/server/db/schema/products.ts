import {
  pgTable,
  uuid,
  text,
  integer,
  bigint,
  numeric,
  boolean,
  jsonb,
  timestamp,
  char,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { categories } from "./categories";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    nameFa: text("name_fa").notNull(),
    nameEn: text("name_en").notNull(),
    descriptionFa: text("description_fa").notNull(),
    descriptionEn: text("description_en").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    wholesalePriceRial: bigint("wholesale_price_rial", { mode: "bigint" }).notNull(),
    moq: integer("moq").notNull(),
    quantityStep: integer("quantity_step").notNull().default(1),
    weightKg: numeric("weight_kg", { precision: 10, scale: 3 }).notNull(),
    volumeCbm: numeric("volume_cbm", { precision: 10, scale: 4 }).notNull(),
    originCountry: char("origin_country", { length: 2 }).notNull().default("CN"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    splitPaymentRatio: numeric("split_payment_ratio", { precision: 3, scale: 2 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    moqCheck: check("moq_min", sql`${table.moq} >= 1`),
    splitRatioCheck: check(
      "split_ratio_range",
      sql`${table.splitPaymentRatio} IS NULL OR (${table.splitPaymentRatio} >= 0.40 AND ${table.splitPaymentRatio} <= 0.50)`,
    ),
  }),
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
