"use client";

import { useState, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface BulkTier {
  minQty: number;
  pricePerUnit: number;
  discountLabel?: string;
}

export interface MoqQuantityInputProps {
  moq: number;
  step: number;
  unitPrice: number;
  bulkTiers: BulkTier[];
  formatPrice: (n: number) => string;
  formatQty: (n: number) => string;
  labels: {
    orderQty: string;
    moqHint: string;
    total: string;
    bulkPricing: string;
    moqError: string;
    units: string;
    perUnit: string;
  };
  onChange?: (qty: number, unitPrice: number, total: number) => void;
}

function getActiveTier(qty: number, tiers: BulkTier[]): BulkTier {
  let active = tiers[0];
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (qty >= tiers[i].minQty) {
      active = tiers[i];
      break;
    }
  }
  return active;
}

export function MoqQuantityInput({
  moq,
  step,
  unitPrice: basePrice,
  bulkTiers,
  formatPrice,
  formatQty,
  labels,
  onChange,
}: MoqQuantityInputProps) {
  const [qty, setQty] = useState(moq);
  const [showError, setShowError] = useState(false);

  const activeTier = getActiveTier(qty, bulkTiers);
  const currentPrice = activeTier.pricePerUnit;
  const total = qty * currentPrice;

  const commit = useCallback(
    (newQty: number) => {
      const snapped = Math.max(moq, Math.round(newQty / step) * step);
      setQty(snapped);
      setShowError(false);
      const tier = getActiveTier(snapped, bulkTiers);
      onChange?.(snapped, tier.pricePerUnit, snapped * tier.pricePerUnit);
    },
    [moq, step, bulkTiers, onChange],
  );

  return (
    <div className="space-y-4">
      {/* Bulk pricing tiers */}
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-sm text-[var(--sr-fg-muted)]">
          <Icon name="tag" size={14} className="text-[var(--sr-gold-400)]" />
          {labels.bulkPricing}
        </div>
        <div className="flex flex-wrap gap-2">
          {bulkTiers.map((tier) => (
            <div
              key={tier.minQty}
              className={cn(
                "min-w-[110px] rounded-[var(--sr-radius)] border p-2.5 text-center transition-all",
                qty >= tier.minQty &&
                  tier.minQty === activeTier.minQty
                  ? "border-[var(--sr-gold-400)]/40 bg-[var(--sr-gold-400)]/[0.08]"
                  : "border-[var(--sr-glass-border)] bg-[var(--sr-glass)]",
              )}
            >
              <div className="text-xs text-[var(--sr-fg-muted)]">
                {formatQty(tier.minQty)}+ {labels.units}
              </div>
              <div className="text-base font-extrabold text-[var(--sr-gold-400)]">
                {formatPrice(tier.pricePerUnit)}
              </div>
              {tier.discountLabel && (
                <div className="mt-0.5 text-[0.65rem] text-emerald-400">
                  {tier.discountLabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantity input */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-[var(--sr-fg-muted)]">
          {labels.orderQty}
          <span className="rounded-full border border-[var(--sr-gold-400)]/20 bg-[var(--sr-gold-400)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--sr-gold-300)]">
            {labels.moqHint}
          </span>
        </div>
        <div className="flex max-w-[280px] overflow-hidden rounded-[var(--sr-radius)] border border-[var(--sr-glass-border)] bg-[var(--sr-surface)]">
          <button
            type="button"
            disabled={qty <= moq}
            onClick={() => commit(qty - step)}
            className="grid w-12 shrink-0 place-items-center bg-[var(--sr-glass)] text-[var(--sr-fg)] transition-colors hover:bg-[var(--sr-gold-400)]/[0.12] hover:text-[var(--sr-gold-400)] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="minus" size={16} strokeWidth={2} />
          </button>
          <input
            type="number"
            value={qty}
            min={moq}
            step={step}
            onChange={(e) => {
              const v = parseInt(e.target.value) || 0;
              setQty(v);
              if (v < moq) setShowError(true);
              else setShowError(false);
            }}
            onBlur={() => commit(qty)}
            className="flex-1 border-none bg-transparent px-2 py-3 text-center text-lg font-bold text-[var(--sr-fg)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => commit(qty + step)}
            className="grid w-12 shrink-0 place-items-center bg-[var(--sr-glass)] text-[var(--sr-fg)] transition-colors hover:bg-[var(--sr-gold-400)]/[0.12] hover:text-[var(--sr-gold-400)]"
          >
            <Icon name="plus" size={16} strokeWidth={2} />
          </button>
        </div>
        <div className="mt-2 text-sm text-[var(--sr-fg-muted)]">
          {labels.total}: <span className="font-bold text-[var(--sr-gold-400)]">{formatPrice(total)}</span>{" "}
          ({formatPrice(currentPrice)}/{labels.perUnit})
        </div>
        {showError && (
          <div className="mt-1.5 text-sm text-red-400">{labels.moqError}</div>
        )}
      </div>
    </div>
  );
}
