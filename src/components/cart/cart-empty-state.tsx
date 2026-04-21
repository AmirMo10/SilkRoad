"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export interface CartEmptyStateProps {
  locale: string;
  title: string;
  description: string;
  browseLabel: string;
}

export function CartEmptyState({ locale, title, description, browseLabel }: CartEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 grid h-24 w-24 place-items-center rounded-full border border-[var(--sr-glass-border)] bg-[var(--sr-glass)] text-[var(--sr-fg-muted)]">
        <Icon name="shoppingBag" size={40} strokeWidth={1.2} />
      </div>
      <h2 className="mb-2 text-2xl font-extrabold">{title}</h2>
      <p className="mb-6 max-w-sm text-[var(--sr-fg-muted)]">{description}</p>
      <Link
        href={`/${locale}/products`}
        className="inline-flex items-center gap-2 rounded-[var(--sr-radius-lg)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-8 py-3 font-bold text-[var(--sr-navy-950)] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] transition-all hover:brightness-110"
      >
        {browseLabel}
      </Link>
    </div>
  );
}
