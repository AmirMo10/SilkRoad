import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--sr-gold-400)] to-[var(--sr-gold-500)] text-[var(--sr-navy-950)] hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)]",
  secondary:
    "sr-glass text-[var(--sr-fg)] hover:bg-white/[0.08]",
  ghost: "text-[var(--sr-fg-muted)] hover:text-[var(--sr-fg)] hover:bg-white/[0.04]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--sr-radius)] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sr-gold-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sr-bg)] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
