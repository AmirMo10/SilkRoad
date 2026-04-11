import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { CategoryFilter } from "@/components/product/category-filter";
import { Icon } from "@/components/ui/icon";
import { getServerTrpc } from "@/server/api/server";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const t = await getTranslations("products");

  const trpc = await getServerTrpc();
  const [{ items: products }, categories] = await Promise.all([
    trpc.products.list({
      categorySlug: params.category,
      search: params.q,
      sort: (params.sort as "newest" | "priceAsc" | "priceDesc" | "moqAsc" | undefined) ?? "newest",
      limit: 24,
    }),
    trpc.categories.list(),
  ]);

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-white/[0.05] py-10">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("catalog.title")}
            </h1>
            <p className="mt-2 text-[var(--sr-fg-muted)]">{t("catalog.subtitle")}</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <CategoryFilter categories={categories} currentSlug={params.category} />

            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-[var(--sr-fg-muted)]">
                  {t("catalog.count", { count: products.length })}
                </div>
                <form method="get" className="flex items-center gap-2">
                  {params.category && (
                    <input type="hidden" name="category" value={params.category} />
                  )}
                  <div className="relative">
                    <Icon
                      name="search"
                      size={16}
                      className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--sr-fg-muted)]"
                    />
                    <input
                      type="search"
                      name="q"
                      defaultValue={params.q ?? ""}
                      placeholder={t("catalog.searchPlaceholder")}
                      className="h-10 w-64 rounded-[var(--sr-radius)] border border-white/10 bg-[var(--sr-navy-800)] ps-9 pe-3 text-sm outline-none focus:border-[var(--sr-gold-500)]/60"
                    />
                  </div>
                </form>
              </div>

              {products.length === 0 ? (
                <div className="sr-glass rounded-[var(--sr-radius-lg)] p-12 text-center text-[var(--sr-fg-muted)]">
                  {t("catalog.empty")}
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
