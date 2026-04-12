"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

export interface CartSummaryProps {
  locale: string;
  subtotal: string;
  shipping: string;
  total: string;
  phase1: string;
  phase2: string;
  ratioPct: number;
  labels: {
    summary: string;
    subtotal: string;
    shipping: string;
    total: string;
    splitTitle: string;
    phase1: string;
    phase1Desc: string;
    phase2: string;
    phase2Desc: string;
    proceed: string;
    secure: string;
  };
  canCheckout: boolean;
  moqError?: string;
}

export function CartSummary({
  locale,
  subtotal,
  shipping,
  total,
  phase1,
  phase2,
  ratioPct,
  labels,
  canCheckout,
  moqError,
}: CartSummaryProps) {
  return (
    <Card className="sticky top-20 flex flex-col gap-4">
      <h3 className="text-lg font-bold">{labels.summary}</h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--sr-fg-muted)]">{labels.subtotal}</dt>
          <dd className="font-semibold">{subtotal}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--sr-fg-muted)]">{labels.shipping}</dt>
          <dd className="font-semibold">{shipping}</dd>
        </div>
        <div className="flex justify-between border-t border-white/[0.06] pt-2">
          <dt className="font-semibold">{labels.total}</dt>
          <dd className="text-xl font-bold text-[var(--sr-gold-400)]">{total}</dd>
        </div>
      </dl>

      <div className="rounded-[var(--sr-radius)] border border-[var(--sr-gold-500)]/20 bg-[var(--sr-gold-500)]/[0.04] p-4">
        <Badge className="mb-2">
          <Icon name="shield" size={12} strokeWidth={2} />
          {labels.secure}
        </Badge>
        <div className="text-sm font-semibold">{labels.splitTitle}</div>
        <div className="mt-3 grid gap-2">
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-semibold">{labels.phase1}</div>
              <div className="text-xs text-[var(--sr-fg-muted)]">{labels.phase1Desc}</div>
            </div>
            <div className="text-end">
              <div className="font-bold text-[var(--sr-gold-400)]">{phase1}</div>
              <div className="text-xs text-[var(--sr-fg-muted)]">
                {locale === "fa"
                  ? `${new Intl.NumberFormat("fa-IR").format(ratioPct)}٪`
                  : `${ratioPct}%`}
              </div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-semibold">{labels.phase2}</div>
              <div className="text-xs text-[var(--sr-fg-muted)]">{labels.phase2Desc}</div>
            </div>
            <div className="text-end">
              <div className="font-bold text-[var(--sr-gold-400)]">{phase2}</div>
              <div className="text-xs text-[var(--sr-fg-muted)]">
                {locale === "fa"
                  ? `${new Intl.NumberFormat("fa-IR").format(100 - ratioPct)}٪`
                  : `${100 - ratioPct}%`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {moqError && (
        <div className="rounded-[var(--sr-radius)] border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-300">
          {moqError}
        </div>
      )}

      <Link
        href={canCheckout ? `/${locale}/checkout` : "#"}
        aria-disabled={!canCheckout}
        className={`inline-flex h-12 items-center justify-center rounded-[var(--sr-radius)] font-semibold transition-all ${
          canCheckout
            ? "bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] text-[var(--sr-navy-950)] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:brightness-110"
            : "cursor-not-allowed border border-white/[0.05] bg-white/[0.02] text-[var(--sr-fg-muted)]"
        }`}
      >
        {labels.proceed}
      </Link>
    </Card>
  );
}
