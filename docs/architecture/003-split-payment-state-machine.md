# ADR 003 — Split Payment State Machine

**Author:** KAVEH + AMIR
**Status:** Accepted

## Context
Every order must track two distinct payment events (Phase 1 upfront, Phase 2 on arrival) plus the physical shipping lifecycle in between. We need a single state machine that the UI, the backend, and the cron jobs all reason about identically.

## States

| State | Meaning | Next allowed |
|---|---|---|
| `awaiting_phase1` | Order created, waiting for upfront payment | `phase1_paid`, `cancelled` |
| `phase1_paid` | Upfront received, ready to be picked & shipped | `processing` |
| `processing` | Company preparing shipment in China | `shipped_from_china`, `cancelled` |
| `shipped_from_china` | Handed to freight forwarder | `in_transit` |
| `in_transit` | Between China and Iran | `customs_clearance` |
| `customs_clearance` | Held at Iranian customs | `arrived_in_iran` |
| `arrived_in_iran` | Cleared customs, awaiting Phase 2 | `awaiting_phase2` (auto) |
| `awaiting_phase2` | Buyer notified, Phase 2 due within grace period | `phase2_paid`, `phase2_overdue` |
| `phase2_overdue` | Grace period expired | `cancelled` (manual), `phase2_paid` |
| `phase2_paid` | Full balance received | `delivering` |
| `delivering` | Last-mile in Iran | `completed` |
| `completed` | Delivered | (terminal) |
| `cancelled` | Cancelled at any pre-`phase2_paid` step | (terminal) |

## Diagram

```
awaiting_phase1
      │ (Phase 1 webhook)
      ▼
phase1_paid ─▶ processing ─▶ shipped_from_china ─▶ in_transit
                                                        │
                                                        ▼
                              arrived_in_iran ◀── customs_clearance
                                       │
                                       ▼ (auto)
                              awaiting_phase2
                                ┌──────┴──────┐
                                ▼             ▼
                         phase2_paid    phase2_overdue
                                │             │
                                ▼             ▼
                            delivering    cancelled (manual)
                                │
                                ▼
                            completed
```

## Transition rules

1. Every transition is **atomic** in a DB transaction. State change + side effects (notifications, timestamps) commit together.
2. Each transition has a **guard function** that asserts current state matches expectation. Mismatches raise `InvalidStateTransition`.
3. Webhooks from payment gateways are **idempotent** — keyed by `(gateway, gateway_ref)`. Duplicate webhooks are no-ops.
4. `arrived_in_iran → awaiting_phase2` is automatic and sets `phase2_due_at = now() + 72h`.
5. A nightly cron scans `awaiting_phase2` orders where `phase2_due_at < now()` and transitions them to `phase2_overdue`, sending escalation SMS.

## Side effects per transition

| Transition | Side effect |
|---|---|
| `→ phase1_paid` | Persist payment row; send "پیش‌پرداخت دریافت شد" SMS + email |
| `→ shipped_from_china` | Send tracking number SMS |
| `→ arrived_in_iran` | Set `phase2_due_at`; send arrival SMS with signed Phase-2 payment link (ADR 006) |
| `→ phase2_paid` | Persist payment row; send "پرداخت کامل شد" SMS |
| `→ completed` | Set `actual_delivery_at`; send delivery confirmation; release any escrowed funds |
| `→ cancelled` | If Phase 1 was paid, mark for refund queue (manual review) |

## Server-side amount validation
On Phase 1 init AND webhook callback, server **recomputes** `phase1_amount_rial` from order total × locked split_ratio. Never trusts gateway-returned amount blindly — only marks `success` if amounts match.

## Open questions
- Refund policy on `cancelled` after Phase 1 paid: forfeit vs. refund? **Default: full refund minus 5% restocking fee.** Configurable per category.

## Alternatives considered
- **Two separate orders** (one per phase): rejected — breaks reporting, doubles inventory math.
- **No state machine, boolean flags**: rejected — invariant violations would silently corrupt data.
