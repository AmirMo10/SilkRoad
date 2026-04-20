"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";

const ORDER_STATUSES = [
  "all",
  "awaiting_phase1",
  "phase1_paid",
  "processing",
  "shipped_from_china",
  "in_transit",
  "customs_clearance",
  "arrived_in_iran",
  "awaiting_phase2",
  "phase2_paid",
  "delivering",
  "completed",
  "cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

interface StatusFilterProps {
  activeStatus: string;
}

export function StatusFilter({ activeStatus }: StatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tStatus = useTranslations("admin.status");
  const locale = useLocale();

  const handleFilter = useCallback(
    (status: OrderStatus) => {
      const params = new URLSearchParams(searchParams.toString());
      if (status === "all") {
        params.delete("status");
      } else {
        params.set("status", status);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {ORDER_STATUSES.map((status) => {
        const isActive =
          status === "all" ? !activeStatus || activeStatus === "all" : activeStatus === status;
        return (
          <button
            key={status}
            onClick={() => handleFilter(status)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "border-[var(--sr-gold-500)]/40 bg-[var(--sr-gold-500)]/10 text-[var(--sr-gold-300)]"
                : "border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)] hover:border-[var(--sr-gold-500)]/30 hover:text-[var(--sr-fg)]"
            }`}
          >
            {status === "all"
              ? locale === "fa"
                ? "همه"
                : "All"
              : tStatus(status as Exclude<OrderStatus, "all">)}
          </button>
        );
      })}
    </div>
  );
}
