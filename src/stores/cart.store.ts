"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShippingTier } from "@/lib/shipping-calculator";

/**
 * Cart line item. All numeric fields use JS `number` (Toman, not Rial) so the
 * store serialises cleanly to localStorage. Convert to Rial bigint at the
 * boundary when calling the shipping/payment calculators.
 */
export interface CartLine {
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
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  shippingTier: ShippingTier;
  splitRatio: number;
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setShippingTier: (tier: ShippingTier) => void;
}

/** Round `quantity` up to the nearest valid value given MOQ + step. */
export function normaliseQuantity(desired: number, moq: number, step: number): number {
  if (desired < moq) return moq;
  const above = desired - moq;
  const snapped = Math.ceil(above / step) * step;
  return moq + snapped;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      shippingTier: "normal",
      splitRatio: 0.5,

      add: (incoming) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === incoming.productId);
          const addQty = incoming.quantity ?? incoming.moq;
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === incoming.productId
                  ? {
                      ...l,
                      quantity: normaliseQuantity(
                        l.quantity + addQty,
                        l.moq,
                        l.quantityStep,
                      ),
                    }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                ...incoming,
                quantity: normaliseQuantity(addQty, incoming.moq, incoming.quantityStep),
              },
            ],
          };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: normaliseQuantity(quantity, l.moq, l.quantityStep) }
              : l,
          ),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [] }),

      setShippingTier: (tier) => set({ shippingTier: tier }),
    }),
    {
      name: "silkroad.cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
