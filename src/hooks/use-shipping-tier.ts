"use client";

import { useMemo } from "react";
import { useCart } from "@/hooks/use-cart";
import {
  quoteAllTiers,
  type ShippingTier,
  type ShippingQuoteToman,
  type CartItem,
} from "@/lib/shipping-calculator";

/**
 * Derives shipping quotes for all three tiers from the current cart contents.
 * Uses the cart store's selected tier and provides a setter.
 */
export function useShippingTier() {
  const cart = useCart();

  const items: CartItem[] = useMemo(
    () =>
      cart.lines.map((l) => ({
        weightKg: l.weightKg,
        volumeCbm: l.volumeCbm,
        quantity: l.quantity,
      })),
    [cart.lines],
  );

  const quotes: Record<ShippingTier, ShippingQuoteToman> = useMemo(
    () => quoteAllTiers(items),
    [items],
  );

  const selectedQuote = quotes[cart.shippingTier];

  return {
    tier: cart.shippingTier,
    setTier: cart.setShippingTier,
    quotes,
    selectedQuote,
    hydrated: cart.hydrated,
  };
}
