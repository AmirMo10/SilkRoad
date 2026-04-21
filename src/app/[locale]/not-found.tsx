import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-8xl font-black text-[var(--sr-gold-500)] opacity-30">
          404
        </div>
        <h1 className="mb-2 text-2xl font-bold">{t("notFound")}</h1>
        <p className="mb-6 text-[var(--sr-fg-muted)]">{t("notFoundDesc")}</p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[var(--sr-gold-500)] px-6 py-2.5 font-semibold text-[var(--sr-navy-950)] transition hover:brightness-110"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
