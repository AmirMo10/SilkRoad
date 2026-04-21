import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { products, type Product } from "@/server/db/schema/products";

export class ProductError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProductError";
  }
}

export interface CreateProductInput {
  slug: string;
  nameFa: string;
  nameEn: string;
  descriptionFa: string;
  descriptionEn: string;
  categoryId: string;
  wholesalePriceRial: bigint;
  moq: number;
  quantityStep: number;
  weightKg: string;
  volumeCbm: string;
  images?: string[];
  splitPaymentRatio?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const [product] = await db
    .insert(products)
    .values({
      slug: input.slug,
      nameFa: input.nameFa,
      nameEn: input.nameEn,
      descriptionFa: input.descriptionFa,
      descriptionEn: input.descriptionEn,
      categoryId: input.categoryId,
      wholesalePriceRial: input.wholesalePriceRial,
      moq: input.moq,
      quantityStep: input.quantityStep,
      weightKg: input.weightKg,
      volumeCbm: input.volumeCbm,
      images: input.images ?? [],
      splitPaymentRatio: input.splitPaymentRatio ?? null,
    })
    .returning();

  return product;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing) {
    throw new ProductError("NOT_FOUND", `Product ${id} not found`);
  }

  const setValues: Record<string, unknown> = { updatedAt: new Date() };

  if (input.slug !== undefined) setValues.slug = input.slug;
  if (input.nameFa !== undefined) setValues.nameFa = input.nameFa;
  if (input.nameEn !== undefined) setValues.nameEn = input.nameEn;
  if (input.descriptionFa !== undefined) setValues.descriptionFa = input.descriptionFa;
  if (input.descriptionEn !== undefined) setValues.descriptionEn = input.descriptionEn;
  if (input.categoryId !== undefined) setValues.categoryId = input.categoryId;
  if (input.wholesalePriceRial !== undefined) setValues.wholesalePriceRial = input.wholesalePriceRial;
  if (input.moq !== undefined) setValues.moq = input.moq;
  if (input.quantityStep !== undefined) setValues.quantityStep = input.quantityStep;
  if (input.weightKg !== undefined) setValues.weightKg = input.weightKg;
  if (input.volumeCbm !== undefined) setValues.volumeCbm = input.volumeCbm;
  if (input.images !== undefined) setValues.images = input.images;
  if (input.splitPaymentRatio !== undefined) setValues.splitPaymentRatio = input.splitPaymentRatio;

  const [updated] = await db
    .update(products)
    .set(setValues)
    .where(eq(products.id, id))
    .returning();

  return updated;
}

export async function deleteProduct(id: string): Promise<{ id: string }> {
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing) {
    throw new ProductError("NOT_FOUND", `Product ${id} not found`);
  }

  await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id));

  return { id };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product || !product.isActive) return null;

  return product;
}
