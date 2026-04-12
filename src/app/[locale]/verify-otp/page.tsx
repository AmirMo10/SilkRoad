"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { useAuth } from "@/hooks/use-auth";

const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const { verifyOtp, sendOtp } = useAuth();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  if (!phone) {
    router.replace(`/${locale}/login`);
    return null;
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (code.replace(/\s/g, "").length !== 6) return;
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(phone, code.replace(/\s/g, ""));
      router.replace(`/${locale}`);
    } catch (err) {
      const errCode = err instanceof Error ? err.message : "INTERNAL";
      setError(t(`errors.${errCode}` as Parameters<typeof t>[0]));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    try {
      await sendOtp(phone);
      setCountdown(RESEND_COOLDOWN);
      setCode("");
    } catch (err) {
      const errCode = err instanceof Error ? err.message : "INTERNAL";
      setError(t(`errors.${errCode}` as Parameters<typeof t>[0]));
    }
  }

  const maskedPhone =
    phone.length >= 4
      ? phone.slice(0, 4) + "***" + phone.slice(-2)
      : phone;

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md items-center px-6 py-16">
        <Card className="w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-grid h-16 w-16 place-items-center rounded-full border border-[var(--sr-gold-500)]/30 bg-[var(--sr-gold-500)]/5 text-[var(--sr-gold-400)]">
              <Icon name="shield" size={28} strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-extrabold">{t("otp.title")}</h1>
            <p className="mt-1 text-sm text-[var(--sr-fg-muted)]">
              {t("otp.subtitle", { phone: maskedPhone })}
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <OtpInput value={code} onChange={setCode} disabled={loading} />

            {error && (
              <div className="rounded-[var(--sr-radius)] border border-red-400/30 bg-red-400/5 px-3 py-2 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={loading || code.replace(/\s/g, "").length !== 6} className="w-full">
              {loading ? "..." : t("otp.verify")}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-[var(--sr-gold-300)] hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              {countdown > 0
                ? t("otp.resendIn", { seconds: String(countdown) })
                : t("otp.resend")}
            </button>
            <Link
              href={`/${locale}/login`}
              className="text-[var(--sr-fg-muted)] hover:text-[var(--sr-fg)]"
            >
              {t("otp.changePhone")}
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
