"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { formatToman, formatMoq, toPersianDigits } from "@/lib/formatters";
import { useCartStore, type CartLine } from "@/stores/cart.store";
import { cn } from "@/lib/utils";

export interface CartItemRowProps {
  line: CartLine;
  locale: string;
  labels: {
    remove: string;
    moqWarning: string;
    perUnit: string;
    lineTotal: string;
    weight: string;
    kg: string;
  };
}

export function CartItemRow({ line, locale, labels }: CartItemRowProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const [removing, setRemoving] = useState(false);

  const name = locale === "fa" ? line.nameFa : line.nameEn;
  const lineTotalToman = line.priceToman * line.quantity;
  const belowMoq = line.quantity < line.moq;
  const atMoq = line.quantity <= line.moq;
  const icon = line.iconSlug as IconName;
  const lineWeightKg = line.quantity * (line.weightKg ?? 0);

  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");
  const fmtMoney = (toman: number) =>
    locale === "fa" ? formatToman(toman) : `${toman.toLocaleString("en-US")} Toman`;

  const handleRemove = useCallback(() => {
    setRemoving(true);
    setTimeout(() => remove(line.productId), 350);
  }, [remove, line.productId]);

  return (
    <Card
      className={cn(
        "flex max-h-[300px] flex-col gap-4 overflow-hidden transition-all duration-300 md:flex-row md:items-center",
        removing && "max-h-0 scale-95 opacity-0",
      )}
    >
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[var(--sr-radius)] border border-white/[0.05] bg-[var(--sr-navy-800)] text-[var(--sr-gold-300)]">
        <Icon name={icon} size={40} strokeWidth={1.2} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1 truncate font-semibold">{name}</h3>
        <div className="text-xs text-[var(--sr-fg-muted)]">
          {locale === "fa" ? formatMoq(line.moq) : `MOQ: ${fmtNum(line.moq)} units`}
        </div>
        <div className="mt-1 text-xs text-[var(--sr-fg-muted)]">
          {fmtMoney(line.priceToman)} / {labels.perUnit}
        </div>
        {lineWeightKg > 0 && (
          <div className="mt-1 flex items-center gap-1 text-xs text-[var(--sr-fg-muted)]">
            <Icon name="truck" size={12} />
            {fmtNum(Math.round(lineWeightKg * 10) / 10)} {labels.kg}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={atMoq}
          onClick={() => setQuantity(line.productId, line.quantity - line.quantityStep)}
          className="sr-glass h-10 w-10 rounded-[var(--sr-radius)] text-lg hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="-"
        >
          −
        </button>
        <input
          type="number"
          value={line.quantity}
          onChange={(e) => setQuantity(line.productId, Number(e.target.value) || line.moq)}
          className="sr-glass h-10 w-24 rounded-[var(--sr-radius)] bg-transparent text-center font-semibold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => setQuantity(line.productId, line.quantity + line.quantityStep)}
          className="sr-glass h-10 w-10 rounded-[var(--sr-radius)] text-lg hover:bg-white/[0.08]"
          aria-label="+"
        >
          +
        </button>
      </div>

      <div className="min-w-[8rem] text-start md:text-end">
        <div className="text-xs text-[var(--sr-fg-muted)]">{labels.lineTotal}</div>
        <div className="text-lg font-bold text-[var(--sr-gold-400)]">
          {fmtMoney(lineTotalToman)}
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className="p-2 text-[var(--sr-fg-muted)] transition-colors hover:text-red-400"
        aria-label={labels.remove}
      >
        <Icon name="trash" size={16} />
      </button>

      {belowMoq && (
        <div className="w-full rounded-[var(--sr-radius)] border border-red-400/30 bg-red-400/10 p-2 text-xs text-red-300 md:w-auto">
          {labels.moqWarning}
        </div>
      )}
    </Card>
  );
}
