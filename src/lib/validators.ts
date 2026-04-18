/**
 * Shared Zod validation schemas — used on both client and server.
 *
 * These are the single source of truth for validation per CLAUDE.md.
 * Infer TypeScript types from these schemas; do not duplicate type definitions.
 */

import { z } from "zod";
import { normalizeIranianMobile } from "@/lib/persian-utils";
import {
  OTP_LENGTH,
  MIN_SPLIT_RATIO,
  MAX_SPLIT_RATIO,
} from "@/lib/constants";

// ─── Phone ────────────────────────────────────────────────────────────────────

/**
 * Validates and normalises an Iranian mobile number.
 * Accepts: 09XXXXXXXXX, 9XXXXXXXXX, +989XXXXXXXXX, 00989XXXXXXXXX.
 * Also accepts Persian/Arabic digits (converted internally).
 * The parsed value is always the normalised form `09XXXXXXXXX`.
 */
export const iranianPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .transform((raw, ctx) => {
    const normalised = normalizeIranianMobile(raw);
    if (normalised === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid Iranian mobile number (expected 09XXXXXXXXX format)",
      });
      return z.NEVER;
    }
    return normalised;
  });

export type IranianPhone = z.infer<typeof iranianPhoneSchema>;

// ─── OTP ─────────────────────────────────────────────────────────────────────

/**
 * Validates an OTP code: exactly OTP_LENGTH (6) digits.
 * Accepts Latin or Persian digits — converts to Latin before validation.
 */
export const otpCodeSchema = z
  .string()
  .regex(
    /^[\d۰-۹]{6}$/,
    `OTP must be exactly ${OTP_LENGTH} digits`,
  )
  .transform((val) =>
    val.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))),
  );

export type OtpCode = z.infer<typeof otpCodeSchema>;

// ─── MOQ quantity ─────────────────────────────────────────────────────────────

/**
 * Returns a Zod schema that validates a quantity value against a product's MOQ.
 *
 * Rules:
 *  - Must be a positive integer.
 *  - Must be >= moq.
 *  - Must be a multiple of step (i.e. (quantity - moq) % step === 0).
 *
 * @param moq  - The product's minimum order quantity.
 * @param step - The allowed increment above MOQ (quantityStep).
 */
export function moqQuantitySchema(moq: number, step: number) {
  return z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be positive")
    .min(moq, `Minimum order quantity is ${moq} units`)
    .refine(
      (qty) => (qty - moq) % step === 0,
      {
        message: `Quantity must be a multiple of ${step} above the MOQ of ${moq}`,
      },
    );
}

// ─── Split ratio ──────────────────────────────────────────────────────────────

/**
 * Validates an upfront split payment ratio.
 * Must be between MIN_SPLIT_RATIO (0.40) and MAX_SPLIT_RATIO (0.50) inclusive.
 * Server MUST re-validate this — never trust a client-supplied ratio.
 */
export const splitRatioSchema = z
  .number()
  .min(MIN_SPLIT_RATIO, `Split ratio must be at least ${MIN_SPLIT_RATIO}`)
  .max(MAX_SPLIT_RATIO, `Split ratio must be at most ${MAX_SPLIT_RATIO}`);

export type SplitRatio = z.infer<typeof splitRatioSchema>;

// ─── Toman amount ─────────────────────────────────────────────────────────────

/**
 * Validates a Toman monetary amount.
 * Must be a positive integer (no fractional Toman).
 * Store amounts as Rial internally; this schema is for UI-layer Toman values.
 */
export const tomanAmountSchema = z
  .number()
  .int("Amount must be a whole number of Toman")
  .positive("Amount must be greater than zero");

export type TomanAmount = z.infer<typeof tomanAmountSchema>;
