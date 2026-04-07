import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--sr-gold-500)]/40 bg-[var(--sr-gold-500)]/10 px-3 py-1 text-xs font-medium text-[var(--sr-gold-300)]",
        className,
      )}
      {...props}
    />
  );
}
