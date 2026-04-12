"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/admin/stat-card";
import { formatToman, toPersianDigits } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const locale = useLocale();
  const t = useTranslations("admin.dashboard");
  const tStatus = useTranslations("admin.status");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;
  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");

  // Placeholder data — tRPC queries will replace this when DB is connected
  const stats = {
    revenueToman: 2_480_000_000,
    orders: 47,
    shipments: 12,
    users: 183,
  };

  const recentOrders = [
    { id: "SR-1047", status: "phase1_paid", totalToman: 185_000_000, tier: "normal", date: "1405/01/23" },
    { id: "SR-1046", status: "in_transit", totalToman: 420_000_000, tier: "turbo", date: "1405/01/22" },
    { id: "SR-1045", status: "arrived_in_iran", totalToman: 95_000_000, tier: "economy", date: "1405/01/20" },
    { id: "SR-1044", status: "completed", totalToman: 680_000_000, tier: "normal", date: "1405/01/18" },
    { id: "SR-1043", status: "awaiting_phase2", totalToman: 312_000_000, tier: "turbo", date: "1405/01/15" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="coin" label={t("totalRevenue")} value={fmt(stats.revenueToman)} />
        <StatCard icon="clipboard" label={t("activeOrders")} value={fmtNum(stats.orders)} />
        <StatCard icon="truck" label={t("pendingShipments")} value={fmtNum(stats.shipments)} />
        <StatCard icon="user" label={t("registeredUsers")} value={fmtNum(stats.users)} />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">{t("recentOrders")}</h2>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--sr-glass-border)] text-[var(--sr-fg-muted)]">
                  <th className="px-4 py-3 text-start font-medium">#</th>
                  <th className="px-4 py-3 text-start font-medium">
                    {locale === "fa" ? "وضعیت" : "Status"}
                  </th>
                  <th className="px-4 py-3 text-start font-medium">
                    {locale === "fa" ? "مبلغ" : "Total"}
                  </th>
                  <th className="px-4 py-3 text-start font-medium">
                    {locale === "fa" ? "ارسال" : "Tier"}
                  </th>
                  <th className="px-4 py-3 text-start font-medium">
                    {locale === "fa" ? "تاریخ" : "Date"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-3">
                      <Badge className="text-xs">
                        {tStatus(order.status as Parameters<typeof tStatus>[0])}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--sr-gold-400)]">
                      {fmt(order.totalToman)}
                    </td>
                    <td className="px-4 py-3">
                      <Icon
                        name={order.tier === "turbo" ? "bolt" : order.tier === "normal" ? "package" : "wave"}
                        size={16}
                        strokeWidth={1.5}
                        className="text-[var(--sr-fg-muted)]"
                      />
                    </td>
                    <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                      {locale === "fa" ? toPersianDigits(order.date) : order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
