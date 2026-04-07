# ADR 005 — MOQ Enforcement Rules

**Author:** AMIR
**Status:** Accepted

## Principle
**No order below MOQ may exist anywhere in the system.** Enforced at every layer; the database is the final guardian.

## Layers

### 1. Product display
- Product card shows MOQ badge: "حداقل سفارش: ۱,۰۰۰ عدد"
- Product detail page shows MOQ + quantity_step prominently with explanation.

### 2. Quantity input
- Default value = product.moq.
- `min={product.moq}`, `step={product.quantity_step}`.
- Decrement button disabled at MOQ.
- Numeric paste below MOQ → snap to MOQ + show toast.

### 3. Add-to-cart action
- Client validation in cart store (`use-cart`).
- If invalid → block + inline error.

### 4. Cart state
- Cart store rejects mutations that would drop quantity below MOQ.
- Cart UI shows error badge on offending lines.

### 5. tRPC mutations
- Every cart/order mutation runs Zod schema with `.refine(qty >= moq)`.
- Server fetches authoritative `product.moq` — never trusts client value.

### 6. Order creation service
- `orderService.create()` re-validates every line against current `product.moq`.
- Throws `BelowMoqError` with offending line; transaction rolls back.

### 7. Database
- `order_items` insert is wrapped in a service that checks MOQ. (No raw inserts.)
- `CHECK (quantity > 0)` at column level (MOQ varies, can't be a static constraint).

## Error message catalog

| Code | Persian | Where |
|---|---|---|
| `MOQ_NOT_MET` | حداقل تعداد سفارش برای این محصول {moq} عدد است | All layers |
| `MOQ_STEP_VIOLATION` | تعداد باید مضربی از {step} باشد | Cart input |
| `MOQ_PRODUCT_INACTIVE` | این محصول موقتاً غیرفعال است | Cart, checkout |

## Bulk pricing tiers (future)
Not in MVP. When added: a `product_price_tiers` table with `(product_id, min_qty, price_rial)`. Price calculation walks tiers descending by `min_qty`.

## Test coverage requirements
- Unit: cart store rejects below-MOQ updates
- Unit: order service throws on below-MOQ items
- E2E: user tries to type 500 when MOQ=1000, sees error, can't proceed to checkout
- E2E: user with valid cart can checkout
