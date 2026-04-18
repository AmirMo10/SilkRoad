"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface ShippingTierOption {
  id: string;
  name: string;
  eta: string;
  icon: IconName;
  costPerKg: number;
}

export interface ShippingEstimateProps {
  tiers: ShippingTierOption[];
  totalWeightKg: number;
  defaultTier?: string;
  formatPrice: (n: number) => string;
  title: string;
  onSelect?: (tierId: string, cost: number) => void;
}

export function ShippingEstimate({
  tiers,
  totalWeightKg,
  defaultTier,
  formatPrice,
  title,
  onSelect,
}: ShippingEstimateProps) {
  const [selected, setSelected] = useState(defaultTier ?? tiers[0]?.id);

  return (
    <div>
      <div className="mb-3 flex items-center gap-1.5 text-sm text-[var(--sr-fg-muted)]">
        <Icon name="truck" size={16} className="text-[var(--sr-gold-400)]" />
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {tiers.map((tier) => {
          const cost = Math.round(totalWeightKg * tier.costPerKg * 1000);
          const isSelected = selected === tier.id;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                setSelected(tier.id);
                onSelect?.(tier.id, cost);
              }}
              className={cn(
                "flex items-center gap-3 rounded-[var(--sr-radius)] border px-4 py-3 text-start transition-all",
                isSelected
                  ? "border-[var(--sr-gold-400)]/50 bg-[var(--sr-gold-400)]/[0.06]"
                  : "border-[var(--sr-glass-border)] bg-[var(--sr-glass)] hover:border-[var(--sr-gold-400)]/25",
              )}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--sr-gold-400)]/10 text-[var(--sr-gold-400)]">
                <Icon name={tier.icon} size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold">{tier.name}</div>
                <div className="mt-0.5 text-[0.7rem] text-[var(--sr-fg-muted)]">
                  {tier.eta}
                </div>
              </div>
              <div className="whitespace-nowrap text-sm font-extrabold text-[var(--sr-gold-400)]">
                {formatPrice(cost)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
