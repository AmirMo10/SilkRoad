"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import {
  TIERS,
  TIER_META,
  type ShippingTier,
  type ShippingQuoteToman,
} from "@/lib/shipping-calculator";
import { cn } from "@/lib/utils";

export interface ShippingTierSelectorProps {
  selected: ShippingTier;
  quotes: Record<ShippingTier, ShippingQuoteToman>;
  onSelect: (tier: ShippingTier) => void;
  locale?: string;
}

const ICON_MAP: Record<ShippingTier, "bolt" | "package" | "wave"> = {
  turbo: "bolt",
  normal: "package",
  economy: "wave",
};

export function ShippingTierSelector({
  selected,
  quotes,
  onSelect,
  locale = "fa",
}: ShippingTierSelectorProps) {
  const t = useTranslations("shipping");

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {TIERS.map((tier) => {
        const quote = quotes[tier];
        const isActive = tier === selected;
        const meta = TIER_META[tier];

        return (
          <button
            key={tier}
            type="button"
            onClick={() => onSelect(tier)}
            className={cn(
              "relative flex flex-col items-center rounded-xl border p-5 text-center transition-all",
              "cursor-pointer hover:border-[var(--sr-gold-400)]/40",
              isActive
                ? "border-[var(--sr-gold-400)] bg-[rgba(212,175,55,0.08)] ring-1 ring-[var(--sr-gold-400)]"
                : "border-[var(--sr-glass-border)] bg-[var(--sr-surface)]",
            )}
          >
            {/* Selected indicator */}
            {isActive && (
              <span className="absolute top-2.5 end-2.5">
                <Icon
                  name="check"
                  size={16}
                  strokeWidth={3}
                  className="text-[var(--sr-gold-400)]"
                />
              </span>
            )}

            {/* Tier icon */}
            <span
              className={cn(
                "mb-3 inline-grid h-14 w-14 place-items-center rounded-2xl border",
                isActive
                  ? "border-[var(--sr-gold-400)]/30 bg-[rgba(212,175,55,0.12)] text-[var(--sr-gold-400)]"
                  : "border-[var(--sr-glass-border)] bg-[var(--sr-glass)] text-[var(--sr-fg-muted)]",
              )}
            >
              <Icon name={ICON_MAP[tier]} size={28} strokeWidth={1.4} />
            </span>

            {/* Name */}
            <h4
              className={cn(
                "text-base font-bold",
                isActive ? "text-[var(--sr-gold-400)]" : "text-[var(--sr-fg)]",
              )}
            >
              {t(`tier.${tier}.name`)}
            </h4>

            {/* Description */}
            <p className="mt-1 text-xs text-[var(--sr-fg-muted)]">
              {t(`tier.${tier}.description`)}
            </p>

            {/* ETA */}
            <span className="mt-2 text-sm font-bold">
              {locale === "fa"
                ? toPersianDigits(`${quote.etaMinDays}`) +
                  " تا " +
                  toPersianDigits(`${quote.etaMaxDays}`) +
                  " " +
                  t("businessDays")
                : `${quote.etaMinDays}–${quote.etaMaxDays} ${t("businessDays")}`}
            </span>

            {/* Cost */}
            <span
              className={cn(
                "mt-1 text-base font-extrabold",
                isActive ? "text-[var(--sr-gold-400)]" : "text-[var(--sr-fg)]",
              )}
            >
              {locale === "fa"
                ? formatToman(quote.costToman)
                : `${quote.costToman.toLocaleString("en-US")} Toman`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
