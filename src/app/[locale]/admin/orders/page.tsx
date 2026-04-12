"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";

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

export default function AdminOrdersPage() {
  const locale = useLocale();
  const t = useTranslations("admin.orders");
  const tStatus = useTranslations("admin.status");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;
  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");

  // Placeholder data — tRPC queries will replace this when DB is connected
  const allOrders = [
    { id: "SR-1047", userId: "U-012", status: "phase1_paid", totalToman: 185_000_000, phase1Toman: 92_500_000, phase2Toman: 92_500_000, tier: "normal", date: "1405/01/23" },
    { id: "SR-1046", userId: "U-008", status: "in_transit", totalToman: 420_000_000, phase1Toman: 210_000_000, phase2Toman: 210_000_000, tier: "turbo", date: "1405/01/22" },
    { id: "SR-1045", userId: "U-034", status: "arrived_in_iran", totalToman: 95_000_000, phase1Toman: 47_500_000, phase2Toman: 47_500_000, tier: "economy", date: "1405/01/20" },
    { id: "SR-1044", userId: "U-019", status: "completed", totalToman: 680_000_000, phase1Toman: 340_000_000, phase2Toman: 340_000_000, tier: "normal", date: "1405/01/18" },
    { id: "SR-1043", userId: "U-005", status: "awaiting_phase2", totalToman: 312_000_000, phase1Toman: 156_000_000, phase2Toman: 156_000_000, tier: "turbo", date: "1405/01/15" },
    { id: "SR-1042", userId: "U-022", status: "processing", totalToman: 148_000_000, phase1Toman: 74_000_000, phase2Toman: 74_000_000, tier: "economy", date: "1405/01/14" },
    { id: "SR-1041", userId: "U-001", status: "cancelled", totalToman: 520_000_000, phase1Toman: 260_000_000, phase2Toman: 260_000_000, tier: "normal", date: "1405/01/12" },
    { id: "SR-1040", userId: "U-041", status: "delivering", totalToman: 230_000_000, phase1Toman: 115_000_000, phase2Toman: 115_000_000, tier: "turbo", date: "1405/01/10" },
  ];

  const orders = activeFilter === "all"
    ? allOrders
    : allOrders.filter((o) => o.status === activeFilter);

  const tierIcon = (tier: string) =>
    tier === "turbo" ? "bolt" : tier === "normal" ? "package" : "wave";
  const tierLabel = (tier: string) =>
    locale === "fa"
      ? tier === "turbo" ? "اکسپرس" : tier === "normal" ? "عادی" : "اقتصادی"
      : tier === "turbo" ? "Turbo" : tier === "Normal" ? "Normal" : "Economy";

  const statusColor = (status: string) => {
    if (status === "completed") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    if (status === "cancelled") return "border-red-500/40 bg-red-500/10 text-red-300";
    if (status.includes("phase2") || status === "arrived_in_iran") return "border-sky-500/40 bg-sky-500/10 text-sky-300";
    return "";
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
      </header>

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              activeFilter === status
                ? "border-[var(--sr-gold-500)]/40 bg-[var(--sr-gold-500)]/10 text-[var(--sr-gold-300)]"
                : "border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)] hover:border-[var(--sr-gold-500)]/30 hover:text-[var(--sr-fg)]"
            }`}
          >
            {status === "all"
              ? locale === "fa" ? "همه" : "All"
              : tStatus(status as Parameters<typeof tStatus>[0])}
          </button>
        ))}
      </div>

      <div className="mb-4 text-sm text-[var(--sr-fg-muted)]">
        {t("count", { count: orders.length })}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)]">
                <th className="px-4 py-3 text-start font-medium">{t("orderId")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("customer")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("status")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("total")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("phase1")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("phase2")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("tier")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("date")}</th>
                <th className="px-4 py-3 text-start font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[var(--sr-fg-muted)]">
                    {t("noOrders")}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3 text-[var(--sr-fg-muted)]">{order.userId}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${statusColor(order.status)}`}>
                        {tStatus(order.status as Parameters<typeof tStatus>[0])}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--sr-gold-400)]">
                      {fmt(order.totalToman)}
                    </td>
                    <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                      {fmt(order.phase1Toman)}
                    </td>
                    <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                      {fmt(order.phase2Toman)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon
                          name={tierIcon(order.tier) as "bolt" | "package" | "wave"}
                          size={16}
                          strokeWidth={1.5}
                          className="text-[var(--sr-fg-muted)]"
                        />
                        <span className="text-xs text-[var(--sr-fg-muted)]">
                          {tierLabel(order.tier)}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                      {locale === "fa" ? toPersianDigits(order.date) : order.date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                          title={t("viewDetails")}
                        >
                          <Icon name="eye" size={16} strokeWidth={1.5} />
                        </button>
                        <button
                          className="rounded-[var(--sr-radius)] p-2 text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-gold-400)]"
                          title={t("updateStatus")}
                        >
                          <Icon name="edit" size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
