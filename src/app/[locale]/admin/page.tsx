import { getLocale, getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/admin/stat-card";
import { formatToman, toPersianDigits } from "@/lib/formatters";
import { getServerTrpc } from "@/server/api/server";

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const t = await getTranslations("admin.dashboard");
  const tStatus = await getTranslations("admin.status");

  const fmt = (n: number) =>
    locale === "fa" ? formatToman(n) : `${n.toLocaleString("en-US")} T`;
  const fmtNum = (n: number) =>
    locale === "fa" ? toPersianDigits(n.toLocaleString("en-US")) : n.toLocaleString("en-US");

  const trpc = await getServerTrpc();
  const [stats, recentOrders] = await Promise.all([
    trpc.admin.stats(),
    trpc.admin.recentOrders({ limit: 10 }),
  ]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-[var(--sr-fg-muted)]">{t("subtitle")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="coin" label={t("totalRevenue")} value={fmt(stats.revenueToman)} />
        <StatCard icon="clipboard" label={t("activeOrders")} value={fmtNum(stats.orders)} />
        <StatCard icon="truck" label={t("pendingShipments")} value={fmtNum(stats.orders)} />
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
                {recentOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString("fa-IR");
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--sr-glass-border)] last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
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
                          name={
                            order.shippingTier === "turbo"
                              ? "bolt"
                              : order.shippingTier === "normal"
                                ? "package"
                                : "wave"
                          }
                          size={16}
                          strokeWidth={1.5}
                          className="text-[var(--sr-fg-muted)]"
                        />
                      </td>
                      <td className="px-4 py-3 text-[var(--sr-fg-muted)]">
                        {locale === "fa" ? toPersianDigits(dateStr) : dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
