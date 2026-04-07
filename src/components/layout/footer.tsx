import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("common");
  return (
    <footer className="border-t border-[var(--sr-glass-border)] mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-[var(--sr-fg-muted)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-lg font-bold text-[var(--sr-gold-400)] mb-1">{t("brand.name")}</div>
            <p>{t("brand.tagline")}</p>
          </div>
          <p className="text-xs">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
