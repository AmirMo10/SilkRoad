"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { SplitPaymentToman } from "@/lib/payment-calculator";

export interface SplitPaymentBreakdownProps {
  split: SplitPaymentToman;
  locale?: string;
}

/**
 * Visual breakdown of the two-phase split payment at checkout.
 * Shows Phase 1 (pay now) and Phase 2 (pay on arrival) as cards
 * with amounts, percentages, and a connecting divider.
 */
export function SplitPaymentBreakdown({
  split,
  locale = "fa",
}: SplitPaymentBreakdownProps) {
  const t = useTranslations("checkout.splitPayment");
  const isFa = locale === "fa";

  const fmtAmt = (n: number) =>
    isFa ? formatToman(n) : `${n.toLocaleString("en-US")} Toman`;

  const fmtPct = (n: number) => (isFa ? `${toPersianDigits(n)}٪` : `${n}%`);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Phase 1 — Pay now */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border p-5",
          "border-[var(--sr-gold-400)] bg-[rgba(212,175,55,0.06)]",
        )}
      >
        {/* Gold accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--sr-gold-400)] to-[var(--sr-gold-300)]" />

        <div className="mb-3 flex items-center gap-2">
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[rgba(212,175,55,0.15)]">
            <Icon
              name="coin"
              size={16}
              strokeWidth={2}
              className="text-[var(--sr-gold-400)]"
            />
          </span>
          <span className="text-sm font-bold text-[var(--sr-gold-400)]">
            {t("phase1Heading")}
          </span>
          <span className="ms-auto rounded-full bg-[rgba(212,175,55,0.15)] px-2.5 py-0.5 text-xs font-bold text-[var(--sr-gold-400)]">
            {fmtPct(split.phase1Pct)}
          </span>
        </div>

        <p className="mb-2 text-xs text-[var(--sr-fg-muted)]">
          {t("phase1Description")}
        </p>

        <div className="text-2xl font-extrabold text-[var(--sr-gold-400)]">
          {fmtAmt(split.phase1Toman)}
        </div>
      </div>

      {/* Phase 2 — Pay on arrival */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border p-5",
          "border-[var(--sr-glass-border)] bg-[var(--sr-surface)]",
        )}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[var(--sr-glass)]">
            <Icon
              name="truck"
              size={16}
              strokeWidth={2}
              className="text-[var(--sr-fg-muted)]"
            />
          </span>
          <span className="text-sm font-bold text-[var(--sr-fg)]">
            {t("phase2Heading")}
          </span>
          <span className="ms-auto rounded-full bg-[var(--sr-glass)] px-2.5 py-0.5 text-xs font-bold text-[var(--sr-fg-muted)]">
            {fmtPct(split.phase2Pct)}
          </span>
        </div>

        <p className="mb-2 text-xs text-[var(--sr-fg-muted)]">
          {t("phase2Description")}
        </p>

        <div className="text-2xl font-extrabold text-[var(--sr-fg)]">
          {fmtAmt(split.phase2Toman)}
        </div>
      </div>
    </div>
  );
}
