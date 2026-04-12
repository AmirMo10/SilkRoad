"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cart.store";

/**
 * SSR-safe cart hook. Returns an empty-ish view until the store hydrates
 * from localStorage on the client, preventing hydration mismatches.
 */
export function useCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const state = useCartStore();

  if (!hydrated) {
    return {
      ...state,
      lines: [] as typeof state.lines,
      hydrated: false as const,
    };
  }

  return { ...state, hydrated: true as const };
}
