export function Footer() {
  return (
    <footer className="border-t border-[var(--sr-glass-border)] mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-[var(--sr-fg-muted)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-lg font-bold text-[var(--sr-gold-400)] mb-1">راه ابریشم</div>
            <p>بازار عمده‌فروشی چین به ایران</p>
          </div>
          <p className="text-xs">© ۱۴۰۵ راه ابریشم. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
