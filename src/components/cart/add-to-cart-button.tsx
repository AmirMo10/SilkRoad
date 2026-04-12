"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { Icon, type IconName } from "@/components/ui/icon";

export interface AddToCartButtonProps {
  productId: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  iconSlug: string;
  priceToman: number;
  moq: number;
  quantityStep: number;
  weightKg: number;
  volumeCbm: number;
  label: string;
  locale: string;
}

export function AddToCartButton({
  productId,
  slug,
  nameFa,
  nameEn,
  iconSlug,
  priceToman,
  moq,
  quantityStep,
  weightKg,
  volumeCbm,
  label,
  locale,
}: AddToCartButtonProps) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const arrow: IconName = locale === "fa" ? "arrowLeft" : "arrowRight";

  return (
    <button
      type="button"
      onClick={() => {
        add({
          productId,
          slug,
          nameFa,
          nameEn,
          iconSlug,
          priceToman,
          moq,
          quantityStep,
          weightKg,
          volumeCbm,
        });
        router.push(`/${locale}/cart`);
      }}
      className="inline-flex h-14 items-center justify-center gap-2 rounded-[var(--sr-radius)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] px-8 text-lg font-semibold text-[var(--sr-navy-950)] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] hover:brightness-110"
    >
      {label}
      <Icon name={arrow} size={20} strokeWidth={2} />
    </button>
  );
}
