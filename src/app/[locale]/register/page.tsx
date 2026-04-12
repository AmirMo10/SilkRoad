"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { isValidIranianMobile } from "@/lib/persian-utils";

export default function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const router = useRouter();
  const { sendOtp, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    router.replace(`/${locale}`);
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidIranianMobile(phone)) {
      setError(t("errors.INVALID_PHONE"));
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone);
      const params = new URLSearchParams({ phone });
      if (name.trim()) params.set("name", name.trim());
      router.push(`/${locale}/verify-otp?${params.toString()}`);
    } catch (err) {
      const code = err instanceof Error ? err.message : "INTERNAL";
      setError(t(`errors.${code}` as Parameters<typeof t>[0]));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-6 py-16">
        <Card className="w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-grid h-16 w-16 place-items-center rounded-full border border-[var(--sr-gold-500)]/30 bg-[var(--sr-gold-500)]/5 text-[var(--sr-gold-400)]">
              <Icon name="user" size={28} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-extrabold">{t("register.title")}</h1>
            <p className="mt-1 text-sm text-[var(--sr-fg-muted)]">{t("register.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                {t("register.nameLabel")}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={t("register.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-[var(--sr-radius)] border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] px-4 text-[var(--sr-fg)] outline-none transition-all placeholder:text-[var(--sr-fg-muted)]/50 focus:border-[var(--sr-gold-400)] focus:ring-2 focus:ring-[var(--sr-gold-500)]/30"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                {t("register.phoneLabel")}
              </label>
              <input
                id="phone"
                type="tel"
                dir="ltr"
                inputMode="numeric"
                autoComplete="tel"
                placeholder={t("register.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 w-full rounded-[var(--sr-radius)] border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] px-4 text-[var(--sr-fg)] outline-none transition-all placeholder:text-[var(--sr-fg-muted)]/50 focus:border-[var(--sr-gold-400)] focus:ring-2 focus:ring-[var(--sr-gold-500)]/30"
              />
            </div>

            {error && (
              <div className="rounded-[var(--sr-radius)] border border-red-400/30 bg-red-400/5 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? "..." : t("register.sendOtp")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--sr-fg-muted)]">
            {t("register.hasAccount")}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-semibold text-[var(--sr-gold-300)] hover:underline"
            >
              {t("register.login")}
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
