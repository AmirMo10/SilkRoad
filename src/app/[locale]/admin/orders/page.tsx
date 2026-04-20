import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { getServerTrpc } from "@/server/api/server";
import { StatusFilter } from "./status-filter";

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const activeStatus = params.status ?? "";

  const locale = await getLocale();
  const t = await getTranslations("admin.orders");
  const tStatus = await getTranslations("admin.status");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;

  const trpc = await getServerTrpc();
  const { items: orders, total } = await trpc.admin.ordersList({
    limit: 50,
    offset: 0,
    status: activeStatus || undefined,
  });

  const tierIcon = (tier: string) =>
    tier === "turbo" ? "bolt" : tier === "normal" ? "package" : "wave";

  const tierLabel = (tier: string) => {
    if (locale === "fa") {
      return tier === "turbo" ? "اکسپرس" : tier === "normal" ? "عادی" : "اقتصادی";
    }
    return tier === "turbo" ? "Turbo" : tier === "normal" ? "Normal" : "Economy";
  };

  const statusColor = (status: string) => {
    if (status === "completed")
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    if (status === "cancelled")
      return "border-red-500/40 bg-red-500/10 text-red-300";
    if (status === "arrived_in_iran" || status.includes("phase2"))
      return "border-sky-500/40 bg-sky-500/10 text-sky-300";
    return "";
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
      </header>

      {/* Status filter pills — client component for URL-based filtering */}
      <Suspense>
        <StatusFilter activeStatus={activeStatus} />
      </Suspense>

      <div className="mb-4 text-sm text-[var(--sr-fg-muted)]">
        {t("count", { count: total })}
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
                <th className="px-4 py-3 text-start font-medium">
                  {locale === "fa" ? "عملیات" : "Actions"}
                </th>
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
                orders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString("fa-IR");
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--sr-fg-muted)]">
                        {order.userId.slice(0, 8)}
                      </td>
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
                            name={tierIcon(order.shippingTier) as "bolt" | "package" | "wave"}
                            size={16}
                            strokeWidth={1.5}
                            className="text-[var(--sr-fg-muted)]"
                          />
                          <span className="text-xs text-[var(--sr-fg-muted)]">
                            {tierLabel(order.shippingTier)}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                        {locale === "fa" ? toPersianDigits(dateStr) : dateStr}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
