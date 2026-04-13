"use client";

import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { PaymentStatus } from "@/types/payment";
import { PAYMENT_STATUS_ORDER } from "@/lib/payment-calculator";

export interface PaymentProgressBarProps {
  currentStatus: PaymentStatus;
  labels: Record<string, string>;
  descriptions?: Record<string, string>;
  locale?: string;
}

const STATUS_ICONS: Record<PaymentStatus, IconName> = {
  pending: "loader",
  upfront_paid: "coin",
  shipped: "package",
  arrived_in_iran: "shield",
  remaining_paid: "coin",
  delivered: "check",
  cancelled: "x",
  refund_pending: "loader",
};

/**
 * Horizontal (desktop) / vertical (mobile) progress timeline
 * showing the order's journey through the split-payment lifecycle.
 */
export function PaymentProgressBar({
  currentStatus,
  labels,
  descriptions,
}: PaymentProgressBarProps) {
  const currentIdx = PAYMENT_STATUS_ORDER.indexOf(currentStatus);
  const isCancelled =
    currentStatus === "cancelled" || currentStatus === "refund_pending";

  return (
    <div className="relative">
      {/* Desktop: horizontal */}
      <div className="hidden sm:block">
        <div className="relative flex items-start justify-between">
          {/* Connector line behind nodes */}
          <div className="absolute top-5 start-5 end-5 h-0.5 bg-[var(--sr-glass-border)]" />
          <div
            className="absolute top-5 start-5 h-0.5 bg-gradient-to-r from-[var(--sr-gold-400)] to-[var(--sr-gold-300)] transition-all duration-500"
            style={{
              width:
                currentIdx <= 0
                  ? "0%"
                  : `${(currentIdx / (PAYMENT_STATUS_ORDER.length - 1)) * 100}%`,
            }}
          />

          {PAYMENT_STATUS_ORDER.map((status, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx && !isCancelled;
            const isFuture = i > currentIdx || isCancelled;

            return (
              <div
                key={status}
                className="relative z-10 flex w-24 flex-col items-center text-center"
              >
                {/* Node circle */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "border-[var(--sr-gold-400)] bg-[var(--sr-gold-400)] text-[var(--sr-navy-950)]",
                    isCurrent &&
                      "border-[var(--sr-gold-400)] bg-[rgba(212,175,55,0.15)] text-[var(--sr-gold-400)] ring-4 ring-[rgba(212,175,55,0.2)]",
                    isFuture &&
                      "border-[var(--sr-glass-border)] bg-[var(--sr-surface)] text-[var(--sr-fg-muted)]",
                  )}
                >
                  {isCompleted ? (
                    <Icon name="check" size={18} strokeWidth={3} />
                  ) : (
                    <Icon
                      name={STATUS_ICONS[status]}
                      size={18}
                      strokeWidth={2}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "mt-2 text-xs font-semibold leading-tight",
                    isCompleted && "text-[var(--sr-gold-400)]",
                    isCurrent && "text-[var(--sr-fg)]",
                    isFuture && "text-[var(--sr-fg-muted)]",
                  )}
                >
                  {labels[status] ?? status}
                </span>

                {/* Description */}
                {descriptions?.[status] && (
                  <span className="mt-0.5 text-[0.65rem] leading-tight text-[var(--sr-fg-muted)]">
                    {descriptions[status]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden">
        <div className="relative flex flex-col gap-0">
          {PAYMENT_STATUS_ORDER.map((status, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx && !isCancelled;
            const isFuture = i > currentIdx || isCancelled;
            const isLast = i === PAYMENT_STATUS_ORDER.length - 1;

            return (
              <div key={status} className="flex gap-3">
                {/* Vertical line + node */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      isCompleted &&
                        "border-[var(--sr-gold-400)] bg-[var(--sr-gold-400)] text-[var(--sr-navy-950)]",
                      isCurrent &&
                        "border-[var(--sr-gold-400)] bg-[rgba(212,175,55,0.15)] text-[var(--sr-gold-400)] ring-4 ring-[rgba(212,175,55,0.2)]",
                      isFuture &&
                        "border-[var(--sr-glass-border)] bg-[var(--sr-surface)] text-[var(--sr-fg-muted)]",
                    )}
                  >
                    {isCompleted ? (
                      <Icon name="check" size={14} strokeWidth={3} />
                    ) : (
                      <Icon
                        name={STATUS_ICONS[status]}
                        size={14}
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 grow",
                        isCompleted
                          ? "bg-[var(--sr-gold-400)]"
                          : "bg-[var(--sr-glass-border)]",
                      )}
                      style={{ minHeight: "2rem" }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-4">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      isCompleted && "text-[var(--sr-gold-400)]",
                      isCurrent && "text-[var(--sr-fg)]",
                      isFuture && "text-[var(--sr-fg-muted)]",
                    )}
                  >
                    {labels[status] ?? status}
                  </span>
                  {descriptions?.[status] && (
                    <p className="mt-0.5 text-xs text-[var(--sr-fg-muted)]">
                      {descriptions[status]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancelled / Refund badge */}
      {isCancelled && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-center text-sm font-semibold text-red-400">
          <Icon name="x" size={16} className="me-1 inline-block" />
          {labels[currentStatus] ?? currentStatus}
        </div>
      )}
    </div>
  );
}
