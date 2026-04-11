import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icon";
import { formatToman, formatMoq } from "@/lib/formatters";
import type { Product } from "@/server/db/schema/products";

// Slug → icon mapping. Unknown slugs fall back to `box`.
const ICON_BY_SLUG: Record<string, IconName> = {
  "wireless-headphones-v2": "headphones",
  "smart-sport-watch": "watch",
  "powerbank-20000": "battery",
  "wifi-security-camera": "camera",
  "phone-case-pro": "box",
  "led-strip-rgb-5m": "bolt",
};

function iconFor(slug: string): IconName {
  return ICON_BY_SLUG[slug] ?? "box";
}

export interface ProductCardProps {
  product: Product;
}

export async function ProductCard({ product }: ProductCardProps) {
  const locale = await getLocale();
  const tProducts = await getTranslations("products");

  const name = locale === "fa" ? product.nameFa : product.nameEn;
  // wholesale_price_rial is Rial internally; Toman = Rial / 10
  const priceToman = Number(product.wholesalePriceRial) / 10;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="flex h-full flex-col p-6">
        <div className="relative mb-4 grid aspect-square place-items-center rounded-[var(--sr-radius)] border border-white/5 bg-[var(--sr-navy-800)] text-[var(--sr-gold-300)] [background:radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%),var(--sr-navy-800)]">
          <Icon name={iconFor(product.slug)} size={72} strokeWidth={1.2} />
        </div>
        <h3 className="mb-3 line-clamp-2 min-h-[2.8em] font-semibold">{name}</h3>
        <Badge className="mb-3 self-start">
          {locale === "fa" ? formatMoq(product.moq) : `MOQ: ${product.moq.toLocaleString("en-US")} units`}
        </Badge>
        <div className="mt-auto">
          <div className="text-lg font-bold text-[var(--sr-gold-400)]">
            {locale === "fa"
              ? formatToman(priceToman)
              : `${priceToman.toLocaleString("en-US")} Toman`}
          </div>
          <div className="text-xs text-[var(--sr-fg-muted)]">{tProducts("card.perUnit")}</div>
        </div>
      </Card>
    </Link>
  );
}
