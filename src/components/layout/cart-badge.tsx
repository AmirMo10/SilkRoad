"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { useCartStore } from "@/stores/cart.store";
import { toPersianDigits } from "@/lib/formatters";

export function CartBadge() {
  const locale = useLocale();
  const count = useCartStore((s) => s.lines.length);

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--sr-radius)] text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-fg)]"
      aria-label={`Cart (${count})`}
    >
      <Icon name="shoppingBag" size={20} strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--sr-gold-500)] px-1 text-[10px] font-bold text-[var(--sr-navy-950)]">
          {locale === "fa" ? toPersianDigits(String(count)) : count}
        </span>
      )}
    </Link>
  );
}
