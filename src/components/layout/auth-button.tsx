"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/hooks/use-auth";

export function AuthButton() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="h-9 w-16 animate-pulse rounded-[var(--sr-radius)] bg-white/[0.06]" />
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-2 text-sm text-[var(--sr-fg-muted)] hover:text-[var(--sr-fg)] transition-colors"
        >
          <Icon name="user" size={18} strokeWidth={1.5} />
          <span className="hidden sm:inline">
            {user.name || user.phone.slice(0, 4) + "***"}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="text-xs text-[var(--sr-fg-muted)] hover:text-red-300 transition-colors"
        >
          {tAuth("profile.logout")}
        </button>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/login`}>
      <Button size="sm">{t("nav.login")}</Button>
    </Link>
  );
}
