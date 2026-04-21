import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { getServerTrpc } from "@/server/api/server";

async function toggleProductAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const isActive = formData.get("isActive") === "true";
  const trpc = await getServerTrpc();
  await trpc.admin.toggleProduct({ id, isActive: !isActive });
  revalidatePath("/[locale]/admin/products", "page");
}

export default async function AdminProductsPage() {
  const locale = await getLocale();
  const t = await getTranslations("admin.products");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;
  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");

  const trpc = await getServerTrpc();
  const [{ items: products, total }, categories] = await Promise.all([
    trpc.admin.productsList({ limit: 50, offset: 0 }),
    trpc.categories.list(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, locale === "fa" ? c.nameFa : c.nameEn]));

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-[var(--sr-radius)] bg-gradient-to-br from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-4 py-2.5 text-sm font-bold text-[var(--sr-navy-950)] shadow-lg shadow-[var(--sr-gold-500)]/25 transition-transform hover:-translate-y-0.5">
          <Icon name="plus" size={18} strokeWidth={2} />
          {t("addProduct")}
        </button>
      </header>

      <div className="mb-4 text-sm text-[var(--sr-fg-muted)]">
        {t("count", { count: total })}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)]">
                <th className="px-4 py-3 text-start font-medium">{t("name")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("price")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("moq")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("weight")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("category")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-semibold">
                    {locale === "fa" ? product.nameFa : product.nameEn}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--sr-gold-400)]">
                    {fmt(product.priceToman)}
                  </td>
                  <td className="px-4 py-3">{fmtNum(product.moq)}</td>
                  <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                    {fmtNum(Number(product.weightKg))} {locale === "fa" ? "کیلوگرم" : "kg"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="text-xs">
                      {categoryMap.get(product.categoryId) ?? product.categoryId.slice(0, 8)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="isActive" value={String(product.isActive)} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 text-xs"
                        title={product.isActive ? t("active") : t("inactive")}
                      >
                        <Icon
                          name={product.isActive ? "toggleOn" : "toggleOff"}
                          size={28}
                          strokeWidth={1.5}
                          className={product.isActive ? "text-emerald-400" : "text-[var(--sr-fg-muted)]"}
                        />
                        <span className={product.isActive ? "text-emerald-400" : "text-[var(--sr-fg-muted)]"}>
                          {product.isActive ? t("active") : t("inactive")}
                        </span>
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                        title={t("edit")}
                      >
                        <Icon name="edit" size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title={t("delete")}
                      >
                        <Icon name="trash" size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
