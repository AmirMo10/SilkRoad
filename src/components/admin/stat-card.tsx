import { Icon, type IconName } from "@/components/ui/icon";

interface StatCardProps {
  icon: IconName;
  label: string;
  value: string;
  sub?: string;
}

export function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="sr-glass rounded-[var(--sr-radius-lg)] p-5">
      <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-[var(--sr-radius)] border border-[var(--sr-gold-500)]/30 bg-[var(--sr-gold-500)]/5 text-[var(--sr-gold-400)]">
        <Icon name={icon} size={22} strokeWidth={1.5} />
      </div>
      <div className="text-sm text-[var(--sr-fg-muted)]">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-[var(--sr-gold-400)]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[var(--sr-fg-muted)]">{sub}</div>}
    </div>
  );
}
