"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/payment";
import type { SplitPaymentToman } from "@/lib/payment-calculator";
import { PaymentProgressBar } from "./PaymentProgressBar";

export interface OrderPaymentStatusProps {
  orderId: string;
  currentStatus: PaymentStatus;
  split: SplitPaymentToman;
  locale?: string;
}

/**
 * Full order payment status card — used on the order detail page.
 * Combines the progress timeline with a two-phase payment summary
 * and a contextual CTA (pay remaining, track shipment, etc.).
 */
export function OrderPaymentStatus({
  orderId,
  currentStatus,
  split,
  locale = "fa",
}: OrderPaymentStatusProps) {
  const t = useTranslations("orders");
  const isFa = locale === "fa";

  const fmtAmt = (n: number) =>
    isFa ? formatToman(n) : `${n.toLocaleString("en-US")} Toman`;

  const fmtPct = (n: number) => (isFa ? `${toPersianDigits(n)}٪` : `${n}%`);

  const labels: Record<string, string> = {
    pending: t("status.pending"),
    upfront_paid: t("status.upfrontPaid"),
    shipped: t("status.shipped"),
    arrived_in_iran: t("status.arrivedInIran"),
    remaining_paid: t("status.remainingPaid"),
    delivered: t("status.delivered"),
    cancelled: t("status.cancelled"),
    refund_pending: t("status.refundPending"),
  };

  const descriptions: Record<string, string> = {
    pending: t("statusDesc.pending"),
    upfront_paid: t("statusDesc.upfrontPaid"),
    shipped: t("statusDesc.shipped"),
    arrived_in_iran: t("statusDesc.arrivedInIran"),
    remaining_paid: t("statusDesc.remainingPaid"),
    delivered: t("statusDesc.delivered"),
  };

  const phase1Paid =
    currentStatus !== "pending" && currentStatus !== "cancelled";
  const phase2Paid =
    currentStatus === "remaining_paid" || currentStatus === "delivered";
  const awaitingPhase2 = currentStatus === "arrived_in_iran";

  return (
    <div className="space-y-6">
      {/* Progress timeline */}
      <div className="rounded-xl border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] p-5">
        <h3 className="mb-4 text-base font-bold">{t("paymentProgress")}</h3>
        <PaymentProgressBar
          currentStatus={currentStatus}
          labels={labels}
          descriptions={descriptions}
          locale={locale}
        />
      </div>

      {/* Two-phase summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Phase 1 */}
        <div
          className={cn(
            "rounded-xl border p-5",
            phase1Paid
              ? "border-[var(--sr-gold-400)]/30 bg-[rgba(212,175,55,0.06)]"
              : "border-[var(--sr-glass-border)] bg-[var(--sr-surface)]",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                name="coin"
                size={18}
                className={
                  phase1Paid
                    ? "text-[var(--sr-gold-400)]"
                    : "text-[var(--sr-fg-muted)]"
                }
              />
              <span className="text-sm font-bold">{t("phase1.title")}</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold",
                phase1Paid
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-[var(--sr-glass)] text-[var(--sr-fg-muted)]",
              )}
            >
              {phase1Paid ? t("paid") : t("unpaid")}
            </span>
          </div>
          <div className="text-xs text-[var(--sr-fg-muted)]">
            {fmtPct(split.phase1Pct)} {t("ofTotal")}
          </div>
          <div
            className={cn(
              "mt-1 text-xl font-extrabold",
              phase1Paid
                ? "text-[var(--sr-gold-400)]"
                : "text-[var(--sr-fg)]",
            )}
          >
            {fmtAmt(split.phase1Toman)}
          </div>
        </div>

        {/* Phase 2 */}
        <div
          className={cn(
            "rounded-xl border p-5",
            phase2Paid
              ? "border-[var(--sr-gold-400)]/30 bg-[rgba(212,175,55,0.06)]"
              : awaitingPhase2
                ? "border-amber-400/40 bg-amber-400/5"
                : "border-[var(--sr-glass-border)] bg-[var(--sr-surface)]",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                name="truck"
                size={18}
                className={
                  phase2Paid
                    ? "text-[var(--sr-gold-400)]"
                    : awaitingPhase2
                      ? "text-amber-400"
                      : "text-[var(--sr-fg-muted)]"
                }
              />
              <span className="text-sm font-bold">{t("phase2.title")}</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold",
                phase2Paid
                  ? "bg-emerald-500/15 text-emerald-400"
                  : awaitingPhase2
                    ? "bg-amber-400/15 text-amber-400"
                    : "bg-[var(--sr-glass)] text-[var(--sr-fg-muted)]",
              )}
            >
              {phase2Paid
                ? t("paid")
                : awaitingPhase2
                  ? t("payNow")
                  : t("unpaid")}
            </span>
          </div>
          <div className="text-xs text-[var(--sr-fg-muted)]">
            {fmtPct(split.phase2Pct)} {t("ofTotal")}
          </div>
          <div
            className={cn(
              "mt-1 text-xl font-extrabold",
              phase2Paid
                ? "text-[var(--sr-gold-400)]"
                : awaitingPhase2
                  ? "text-amber-400"
                  : "text-[var(--sr-fg)]",
            )}
          >
            {fmtAmt(split.phase2Toman)}
          </div>
        </div>
      </div>

      {/* CTA — pay remaining */}
      {awaitingPhase2 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 text-center">
          <p className="mb-3 text-sm text-[var(--sr-fg-muted)]">
            {t("remainingCta")}
          </p>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-bold transition-all",
              "bg-gradient-to-r from-[var(--sr-gold-400)] to-[var(--sr-gold-300)] text-[var(--sr-navy-950)]",
              "hover:shadow-lg hover:shadow-[var(--sr-gold-400)]/20",
            )}
          >
            {t("payRemaining")}
            <Icon name="arrowRight" size={18} className="rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
