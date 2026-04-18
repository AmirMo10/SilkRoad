/**
 * App-wide constants for SilkRoad.
 *
 * All magic numbers live here so calculators, validators, and UI components
 * can reference a single source of truth. Use UPPER_SNAKE_CASE per CLAUDE.md.
 *
 * Monetary values are in Rial unless the name ends in _TOMAN.
 */

// ─── MOQ ────────────────────────────────────────────────────────────────────

/** Default minimum order quantity when no product-level MOQ is specified. */
export const DEFAULT_MOQ = 1_000;

/** Default step size for quantity increments (must be a divisor of MOQ). */
export const MOQ_STEP = 100;

// ─── Split Payment ───────────────────────────────────────────────────────────

/** Default upfront payment ratio (50 % of order total). */
export const DEFAULT_SPLIT_RATIO = 0.5;

/** Minimum allowed upfront ratio (40 %). */
export const MIN_SPLIT_RATIO = 0.4;

/** Maximum allowed upfront ratio (50 %). */
export const MAX_SPLIT_RATIO = 0.5;

// ─── Shipping — rate per kg (Rial) ──────────────────────────────────────────

/** Air-freight (Turbo) rate per chargeable kg in Rial. */
export const SHIPPING_RATE_TURBO_PER_KG_RIAL = 260_000n;

/** Mixed-transport (Normal) rate per chargeable kg in Rial. */
export const SHIPPING_RATE_NORMAL_PER_KG_RIAL = 130_000n;

/** Sea-freight (Economy/Slow) rate per chargeable kg in Rial. */
export const SHIPPING_RATE_ECONOMY_PER_KG_RIAL = 55_000n;

// ─── Shipping — base cost (Rial) ─────────────────────────────────────────────

/** Turbo tier fixed base cost in Rial (5 000 000 Toman). */
export const SHIPPING_BASE_TURBO_RIAL = 50_000_000n;

/** Normal tier fixed base cost in Rial (2 500 000 Toman). */
export const SHIPPING_BASE_NORMAL_RIAL = 25_000_000n;

/** Economy tier fixed base cost in Rial (1 000 000 Toman). */
export const SHIPPING_BASE_ECONOMY_RIAL = 10_000_000n;

// ─── Shipping — ETA (business days) ─────────────────────────────────────────

/** Turbo (air freight) earliest delivery estimate in business days. */
export const TURBO_ETA_MIN = 7;

/** Turbo (air freight) latest delivery estimate in business days. */
export const TURBO_ETA_MAX = 15;

/** Normal (mixed transport) earliest delivery estimate in business days. */
export const NORMAL_ETA_MIN = 20;

/** Normal (mixed transport) latest delivery estimate in business days. */
export const NORMAL_ETA_MAX = 35;

/** Economy (sea freight) earliest delivery estimate in business days. */
export const ECONOMY_ETA_MIN = 45;

/** Economy (sea freight) latest delivery estimate in business days. */
export const ECONOMY_ETA_MAX = 70;

// ─── Shipping — volumetric weight ────────────────────────────────────────────

/**
 * IATA volumetric weight factor: 1 CBM = 167 chargeable kg.
 * Used to convert volume (CBM) to equivalent weight for pricing.
 */
export const VOLUMETRIC_FACTOR_KG_PER_CBM = 167;

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** OTP code validity window in seconds (5 minutes). */
export const OTP_TTL_SECONDS = 300;

/** Number of digits in an OTP code. */
export const OTP_LENGTH = 6;

/** JWT access-token TTL expressed as a Vercel/jsonwebtoken duration string. */
export const JWT_ACCESS_TTL = "15m";

/** Refresh-token validity in days. */
export const REFRESH_TTL_DAYS = 7;

/** Maximum consecutive failed OTP attempts before lockout. */
export const OTP_MAX_ATTEMPTS = 5;
