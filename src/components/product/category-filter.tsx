import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { Category } from "@/server/db/schema/categories";

export interface CategoryFilterProps {
  categories: Category[];
  currentSlug?: string;
}

export async function CategoryFilter({ categories, currentSlug }: CategoryFilterProps) {
  const locale = await getLocale();
  const t = await getTranslations("products");

  const items = [
    { slug: "", nameFa: "همه محصولات", nameEn: "All Products" },
    ...categories,
  ];

  return (
    <aside className="sr-glass rounded-[var(--sr-radius-lg)] p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--sr-gold-400)]">
        <Icon name="filter" size={16} strokeWidth={2} />
        {t("filter.categories")}
      </div>
      <ul className="space-y-1">
        {items.map((cat) => {
          const active = (currentSlug ?? "") === (cat.slug ?? "");
          const name = locale === "fa" ? cat.nameFa : cat.nameEn;
          const href = cat.slug ? `/products?category=${cat.slug}` : "/products";
          return (
            <li key={cat.slug || "all"}>
              <Link
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--sr-gold-500)]/15 text-[var(--sr-gold-300)]"
                    : "text-[var(--sr-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--sr-fg)]",
                )}
              >
                <span>{name}</span>
                {active && <Icon name="check" size={14} strokeWidth={2.5} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
