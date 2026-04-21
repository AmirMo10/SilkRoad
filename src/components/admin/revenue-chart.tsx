"use client";

import { cn } from "@/lib/utils";

export interface RevenueBarData {
  label: string;
  current: number;
  previous: number;
  tooltip: string;
}

export interface RevenueChartProps {
  data: RevenueBarData[];
  maxValue: number;
  yLabels: string[];
  legendCurrent: string;
  legendPrevious: string;
}

/**
 * CSS-only bar chart showing monthly revenue comparison.
 * Gold bars for current period, muted bars for previous.
 * Hover reveals tooltip with exact amount.
 */
export function RevenueChart({
  data,
  maxValue,
  yLabels,
  legendCurrent,
  legendPrevious,
}: RevenueChartProps) {
  return (
    <div className="rounded-[var(--sr-radius-lg)] border border-[var(--sr-glass-border)] bg-[var(--sr-glass)] p-6">
      {/* Legend */}
      <div className="mb-4 flex items-center justify-end gap-4 text-xs text-[var(--sr-fg-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--sr-gold-400)]" />
          {legendCurrent}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-white/15" />
          {legendPrevious}
        </span>
      </div>

      <div className="flex">
        {/* Y-axis */}
        <div className="flex h-40 shrink-0 flex-col justify-between pe-2 text-end text-[0.6rem] text-[var(--sr-fg-muted)]">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 items-end gap-0 border-b border-[var(--sr-glass-border)] pb-2">
          {data.map((item) => {
            const currentH = Math.round((item.current / maxValue) * 100);
            const previousH = Math.round((item.previous / maxValue) * 100);

            return (
              <div
                key={item.label}
                className="group relative flex flex-1 flex-col items-center gap-1"
              >
                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-full z-10 mb-2 hidden rounded-lg border border-[var(--sr-glass-border)] bg-[var(--sr-navy-700)] px-2.5 py-1.5 text-[0.65rem] font-bold text-[var(--sr-gold-300)] group-hover:block">
                  {item.tooltip}
                </div>

                {/* Bar pair */}
                <div className="flex h-40 items-end gap-[3px]">
                  <div
                    className="w-3.5 rounded-t bg-white/[0.08] transition-all duration-700 md:w-3"
                    style={{ height: `${previousH}%` }}
                  />
                  <div
                    className={cn(
                      "w-3.5 rounded-t transition-all duration-700 group-hover:brightness-125 md:w-3",
                      "bg-gradient-to-t from-[rgba(212,175,55,0.3)] to-[var(--sr-gold-400)]",
                    )}
                    style={{ height: `${currentH}%` }}
                  />
                </div>

                {/* Label */}
                <span className="text-[0.6rem] text-[var(--sr-fg-muted)]">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
