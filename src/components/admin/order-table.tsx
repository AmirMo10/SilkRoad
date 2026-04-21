"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface OrderRow {
  id: string;
  customer: string;
  status: string;
  statusColor: "default" | "green" | "blue" | "red";
  total: string;
  phase1: string;
  phase2: string;
  tierIcon: IconName;
  tierLabel: string;
  date: string;
}

export interface OrderTableProps {
  rows: OrderRow[];
  filters: string[];
  columns: {
    id: string;
    customer: string;
    status: string;
    total: string;
    phase1: string;
    phase2: string;
    tier: string;
    date: string;
    actions: string;
  };
  countLabel: (count: number) => string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const BADGE_CLASSES: Record<string, string> = {
  default:
    "border-[var(--sr-gold-400)]/20 bg-[var(--sr-gold-400)]/10 text-[var(--sr-gold-300)]",
  green: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  blue: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  red: "border-red-400/40 bg-red-400/10 text-red-300",
};

/**
 * Interactive order management table with status filter pills.
 * Filters rows client-side, shows count, and provides action buttons.
 */
export function OrderTable({
  rows,
  filters,
  columns,
  countLabel,
  onView,
  onEdit,
}: OrderTableProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const filtered =
    activeFilter === filters[0]
      ? rows
      : rows.filter((r) => r.status === activeFilter);

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              activeFilter === f
                ? "border-[var(--sr-gold-400)]/40 bg-[var(--sr-gold-400)]/10 text-[var(--sr-gold-300)]"
                : "border-[var(--sr-glass-border)] bg-transparent text-[var(--sr-fg-muted)] hover:border-[var(--sr-gold-400)]/30 hover:text-[var(--sr-fg)]",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="mb-3 text-sm text-[var(--sr-fg-muted)]">
        {countLabel(filtered.length)}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[var(--sr-radius-lg)] border border-[var(--sr-glass-border)] bg-[var(--sr-surface)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--sr-glass-border)] bg-white/[0.02]">
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.id}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.customer}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.status}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.total}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.phase1}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.phase2}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.tier}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.date}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-[var(--sr-fg-muted)]">
                {columns.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[var(--sr-glass-border)] transition-colors last:border-b-0 hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                  {row.customer}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      BADGE_CLASSES[row.statusColor],
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--sr-gold-400)]">
                  {row.total}
                </td>
                <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                  {row.phase1}
                </td>
                <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                  {row.phase2}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon
                      name={row.tierIcon}
                      size={16}
                      className="text-[var(--sr-fg-muted)]"
                    />
                    <span className="text-xs text-[var(--sr-fg-muted)]">
                      {row.tierLabel}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                  {row.date}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onView?.(row.id)}
                      className="rounded-md p-1.5 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                    >
                      <Icon name="eye" size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit?.(row.id)}
                      className="rounded-md p-1.5 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
