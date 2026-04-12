"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--sr-radius)] text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-fg)]"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <Icon name={open ? "x" : "menu"} size={22} strokeWidth={1.5} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <nav
        className={cn(
          "fixed top-0 z-50 flex h-full w-72 flex-col bg-[var(--sr-surface)] shadow-2xl transition-transform duration-300 ease-out",
          locale === "fa" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : locale === "fa"
              ? "translate-x-full"
              : "-translate-x-full",
        )}
      >
        {/* Panel header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--sr-glass-border)] px-5">
          <span className="text-lg font-bold text-[var(--sr-gold-400)]">
            {t("brand.name")}
          </span>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--sr-radius)] text-[var(--sr-fg-muted)] transition-colors hover:bg-white/[0.06] hover:text-[var(--sr-fg)]"
            aria-label="Close menu"
          >
            <Icon name="x" size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {([
            { href: `/${locale}`, label: t("nav.home"), icon: "sparkle" as const },
            { href: `/${locale}/products`, label: t("nav.products"), icon: "box" as const },
            { href: `/${locale}/how-it-works`, label: t("nav.howItWorks"), icon: "package" as const },
            { href: `/${locale}/shipping-info`, label: t("nav.shipping"), icon: "truck" as const },
            { href: `/${locale}/about`, label: t("nav.about"), icon: "globe" as const },
            { href: `/${locale}/cart`, label: t("nav.cart"), icon: "shoppingBag" as const },
          ]).map((item) => {
            const isActive = pathname === item.href || pathname === item.href + "/";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--sr-radius)] px-3 py-3 text-sm transition-all",
                  isActive
                    ? "bg-[var(--sr-gold-500)]/10 font-semibold text-[var(--sr-gold-400)]"
                    : "text-[var(--sr-fg-muted)] hover:bg-white/[0.04] hover:text-[var(--sr-fg)]",
                )}
              >
                <Icon name={item.icon} size={20} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Login link at bottom */}
        <div className="border-t border-[var(--sr-glass-border)] p-4">
          <Link
            href={`/${locale}/login`}
            onClick={close}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--sr-radius)] bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] font-semibold text-[var(--sr-navy-950)] shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] transition-all hover:brightness-110"
          >
            <Icon name="user" size={18} strokeWidth={1.5} />
            {t("nav.login")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
