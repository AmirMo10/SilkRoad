"use client";

import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, "").split("").slice(0, length);

  const focusAt = useCallback(
    (i: number) => {
      if (i >= 0 && i < length) refs.current[i]?.focus();
    },
    [length],
  );

  const handleInput = useCallback(
    (i: number, char: string) => {
      if (!/^\d$/.test(char)) return;
      const next = digits.slice();
      next[i] = char;
      onChange(next.join(""));
      focusAt(i + 1);
    },
    [digits, onChange, focusAt],
  );

  const handleKeyDown = useCallback(
    (i: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const next = digits.slice();
        if (next[i]) {
          next[i] = "";
          onChange(next.join(""));
        } else if (i > 0) {
          next[i - 1] = "";
          onChange(next.join(""));
          focusAt(i - 1);
        }
      } else if (e.key === "ArrowLeft") {
        focusAt(i - 1);
      } else if (e.key === "ArrowRight") {
        focusAt(i + 1);
      }
    },
    [digits, onChange, focusAt],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted) {
        onChange(pasted.padEnd(length, "").slice(0, length));
        focusAt(Math.min(pasted.length, length - 1));
      }
    },
    [length, onChange, focusAt],
  );

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d === " " ? "" : d}
          disabled={disabled}
          className="h-14 w-12 rounded-[var(--sr-radius)] border border-[var(--sr-glass-border)] bg-[var(--sr-surface)] text-center text-2xl font-bold text-[var(--sr-fg)] outline-none transition-all focus:border-[var(--sr-gold-400)] focus:ring-2 focus:ring-[var(--sr-gold-500)]/30 disabled:opacity-50"
          onChange={(e) => handleInput(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
