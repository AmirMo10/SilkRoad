"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { key: string; icon: IconName; href: string }[] = [
  { key: "dashboard", icon: "chart", href: "" },
  { key: "products", icon: "box", href: "/products" },
  { key: "orders", icon: "clipboard", href: "/orders" },
  { key: "shipments", icon: "truck", href: "/shipments" },
  { key: "payments", icon: "coin", href: "/payments" },
  { key: "users", icon: "user", href: "/users" },
  { key: "settings", icon: "settings", href: "/settings" },
];

export function AdminSidebar() {
  const locale = useLocale();
  const tAdmin = useTranslations("admin");
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const base = `/${locale}/admin`;

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-60 flex-col border-e border-[var(--sr-glass-border)] bg-[var(--sr-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--sr-glass-border)] px-5 py-4">
        <Icon name="shield" size={20} strokeWidth={1.5} className="text-[var(--sr-gold-400)]" />
        <span className="text-sm font-bold text-[var(--sr-gold-400)]">
          {tAdmin("panelTitle")}
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const href = `${base}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === base || pathname === `${base}/`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--sr-radius)] px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-[var(--sr-gold-500)]/10 font-semibold text-[var(--sr-gold-400)]"
                  : "text-[var(--sr-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--sr-fg)]",
              )}
            >
              <Icon name={item.icon} size={18} strokeWidth={1.5} />
              {t(item.key as Parameters<typeof t>[0])}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
