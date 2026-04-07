# ADR 006 — Security Architecture

**Author:** BEHNAM
**Status:** Accepted

## Threat model (top concerns)
1. **Payment manipulation** — client tampering with split amounts or item prices.
2. **Phase 2 link replay** — attacker reuses someone else's Phase 2 payment URL.
3. **MOQ bypass** — direct API calls below MOQ to game pricing.
4. **Auth bypass** — OTP brute force, JWT tampering.
5. **PII leakage** — phone numbers, addresses exposed via mis-scoped queries.
6. **SQL injection / XSS / CSRF** — standard OWASP Top 10.
7. **DDoS / volumetric** — mitigated at ArvanCloud CDN edge.

## Auth design

### JWT
- **Access token:** 15 min TTL, signed with HS256 (secret) or EdDSA (key pair).
- **Refresh token:** 7 days, opaque random 256-bit, hashed in DB, rotated on use.
- Library: `jose` (sanctions-safe, no telemetry).
- Access tokens carry: `sub` (user_id), `role`, `iat`, `exp`. Nothing sensitive.

### Password
- Argon2id via `@node-rs/argon2`. Memory cost 64 MiB, iterations 3, parallelism 1.
- Pepper from env var (rotated annually).

### OTP
- 6-digit numeric, 5-minute TTL in Redis, max 5 attempts per code, max 3 codes per phone per hour.
- Rate-limit per phone AND per IP.

### RBAC matrix

| Role | Browse products | Place order | View own orders | View all orders | Manage products | Manage settings |
|---|---|---|---|---|---|---|
| anonymous | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| buyer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| company_admin | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| platform_admin | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |

Enforced via tRPC middleware that runs before every protected procedure.

## Split payment security

### Server-side amount validation
On every payment webhook, server recomputes `expected = order.total × order.split_ratio` and only marks payment `success` if `gateway_amount == expected`. Mismatch → quarantine + alert.

### Phase 2 signed links
URL format: `https://silkroad.ir/orders/{id}/pay-phase2?token={signed}`

`signed` = base64url(HMAC-SHA256(secret, `${order_id}|${phase}|${exp}`))

- 72-hour TTL, embedded in `exp`.
- Verified server-side on link click.
- One-time-use: after successful payment, token is added to a Redis `used_tokens` set with TTL = link TTL + 1h.
- Replay → 410 Gone.

### Webhook idempotency
- All gateway webhooks keyed by `(gateway, gateway_ref)` unique constraint in `payments`.
- Duplicate webhook → 200 OK no-op.

## Headers
Set in `next.config.ts`:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; img-src 'self' https://*.arvancloud.ir data:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://*.zarinpal.com https://*.idpay.ir; frame-ancestors 'none'; base-uri 'self'`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## CSRF
- All mutating tRPC procedures require a custom header (`x-csrf-token`) matching a per-session token in HttpOnly cookie.
- GET tRPC calls exempt.

## Input validation
- Every tRPC input validated by Zod schema.
- HTML user-content sanitized via DOMPurify before render (only product reviews, if added).

## Logging & audit
- Structured JSON logs (Pino).
- **Security events** logged at INFO+: failed login, OTP rate limit hit, invalid Phase-2 token, RBAC denial, webhook signature mismatch.
- Logs shipped to Loki (no PII in log lines — only IDs).

## Secrets management
- All secrets in env vars, never committed.
- Production secrets in ArvanCloud secret store or `.env.production` with restricted file perms.
- JWT, HMAC, password pepper rotated annually.

## Dependency hygiene
- Weekly `npm audit` in CI; fail build on high/critical.
- Dependabot enabled.

## Sanctions awareness
- No US-controlled CDN, auth provider, or analytics in the request path.
- Build-time dependencies (npm registry mirror) acceptable but mirrored to `registry.npmmirror.com` for redundancy.
