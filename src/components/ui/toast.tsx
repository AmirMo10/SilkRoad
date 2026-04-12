"use client";

import { Icon } from "@/components/ui/icon";
import { useToastStore, type ToastType } from "@/stores/toast.store";
import { cn } from "@/lib/utils";

const typeStyles: Record<ToastType, string> = {
  success:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  error:
    "border-red-400/40 bg-red-400/10 text-red-300",
  info:
    "border-[var(--sr-gold-500)]/40 bg-[var(--sr-gold-500)]/10 text-[var(--sr-gold-300)]",
};

const typeIcon: Record<ToastType, "check" | "x" | "sparkle"> = {
  success: "check",
  error: "x",
  info: "sparkle",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[var(--sr-radius)] border px-4 py-3 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-300",
            typeStyles[t.type],
          )}
          role="alert"
        >
          <Icon name={typeIcon[t.type]} size={18} strokeWidth={2} className="shrink-0" />
          <p className="flex-1 text-sm font-medium">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <Icon name="x" size={16} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
