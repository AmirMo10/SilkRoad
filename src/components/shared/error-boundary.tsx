"use client";

import { useTranslations } from "next-intl";

export function ErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold">{t("generic")}</h2>
        <button
          onClick={reset}
          className="mt-4 rounded-xl bg-[var(--sr-gold-500)] px-6 py-2.5 font-semibold text-[var(--sr-navy-950)] transition hover:brightness-110"
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
}
