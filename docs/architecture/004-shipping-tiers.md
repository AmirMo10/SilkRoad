# ADR 004 — Shipping Tiers

**Author:** FARHAD
**Status:** Accepted

## Tier definitions

| Tier | Persian | Mode | ETA (business days) | Cost level |
|---|---|---|---|---|
| `turbo` | اکسپرس / فوری | Air freight | 7–15 | Highest |
| `normal` | عادی | Mixed (air + land) | 20–35 | Medium |
| `economy` | اقتصادی | Sea freight | 45–75 | Lowest |

## Pricing formula

```
shipping_cost = base_cost
              + max(weight_charge, volume_charge)
              + customs_handling

weight_charge = ceil(total_weight_kg) × rate_per_kg
volume_charge = total_volume_cbm × volumetric_factor × rate_per_kg
volumetric_factor = 167   (standard air-freight DIM divisor for kg/m³)
customs_handling = flat per order (configurable per tier)
```

`base_cost`, `rate_per_kg`, `customs_handling` come from `shipping_rates` table, indexed by `(tier, category_id, weight_bracket)`.

## Quote interface

```ts
interface ShippingQuote {
  tier: ShippingTier;
  costRial: bigint;
  etaMinDays: number;
  etaMaxDays: number;
  etaMinJalali: string;  // ۱۴۰۵/۰۱/۲۰
  etaMaxJalali: string;
}

quoteShipping(input: {
  items: Array<{ productId, qty, weightKg, volumeCbm, categoryId }>;
  tier: ShippingTier;
}): ShippingQuote
```

At checkout, the cart calls `quoteShipping` once per tier and renders all 3 cards side-by-side.

## Shipment status timeline

`processing_in_china → shipped_from_china → in_transit → customs_clearance → arrived_in_iran → last_mile_delivery → delivered`

This is independent of the order state machine but transitions on it trigger order-state transitions (see ADR 003).

## Tracking integration
- China-side: freight forwarder API (FARHAD's adapter — pluggable, single interface).
- Iran last-mile: Tipax / Post Pishtaz / Chapar adapters.

## Tier-specific UI rules
- All 3 tier cards always visible at checkout. Cheapest by default.
- Selected tier highlighted with gold accent + scale animation.
- ETA shown in Jalali date range, not absolute days, to feel concrete.
