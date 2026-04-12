"use client";

import { useCartStore } from "@/stores/cart.store";
import { Icon, type IconName } from "@/components/ui/icon";
import type { ShippingTier } from "@/lib/shipping-calculator";
import { cn } from "@/lib/utils";

const TIERS: { key: ShippingTier; icon: IconName }[] = [
  { key: "turbo", icon: "bolt" },
  { key: "normal", icon: "package" },
  { key: "economy", icon: "wave" },
];

export interface ShippingTierSelectorProps {
  labels: Record<ShippingTier, { name: string; description: string; eta: string }>;
  costs: Record<ShippingTier, string>;
  heading: string;
}

export function ShippingTierSelector({ labels, costs, heading }: ShippingTierSelectorProps) {
  const current = useCartStore((s) => s.shippingTier);
  const setTier = useCartStore((s) => s.setShippingTier);

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold">{heading}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => {
          const active = current === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTier(t.key)}
              className={cn(
                "sr-glass rounded-[var(--sr-radius-lg)] p-5 text-start transition-all",
                active
                  ? "border-[var(--sr-gold-500)] shadow-[0_0_0_1px_var(--sr-gold-500)]"
                  : "hover:border-[var(--sr-gold-500)]/40",
              )}
            >
              <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-[var(--sr-radius)] border border-[var(--sr-gold-500)]/30 bg-[var(--sr-gold-500)]/5 text-[var(--sr-gold-400)]">
                <Icon name={t.icon} size={24} strokeWidth={1.4} />
              </div>
              <div className="text-lg font-bold text-[var(--sr-gold-400)]">{labels[t.key].name}</div>
              <p className="mt-1 text-sm text-[var(--sr-fg-muted)]">{labels[t.key].description}</p>
              <div className="mt-2 text-sm font-semibold">{labels[t.key].eta}</div>
              <div className="mt-3 text-sm font-bold">{costs[t.key]}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
