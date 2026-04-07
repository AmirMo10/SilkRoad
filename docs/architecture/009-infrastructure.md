# ADR 009 — Infrastructure & Operations

**Author:** OMID
**Status:** Accepted

## Hosting target
**Primary:** ArvanCloud (Iranian, sanctions-safe, low latency to Iranian users).
**Fallback:** Hetzner EU (German, non-US, used for backups + read replica).

## Topology

```
                 ┌──────────────┐
   Users ──────▶ │ ArvanCloud   │
                 │     CDN      │
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ Caddy / Nginx│  (TLS, security headers)
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │ Next.js app  │  (Docker, 2+ replicas behind LB)
                 └──┬───────┬───┘
                    │       │
            ┌───────▼┐    ┌─▼────────┐
            │ Postgres│   │  Redis   │
            │  (HA)   │   │ (BullMQ) │
            └─────────┘   └──────────┘
                    │
                    ▼
            ┌─────────────┐
            │   Object    │
            │   Storage   │  (ArvanCloud S3-compatible)
            └─────────────┘
```

## Environments
| Env | Purpose | URL pattern |
|---|---|---|
| dev | Local laptops | localhost:3000 |
| staging | Pre-prod | staging.silkroad.ir |
| production | Live | silkroad.ir |

## CI/CD pipeline (GitHub Actions)
1. **Lint** (ESLint, Prettier check)
2. **Typecheck** (`tsc --noEmit`)
3. **Unit tests** (Vitest)
4. **Build** (`next build`)
5. **Security scan** (`npm audit`, Trivy on Docker image)
6. **E2E** (Playwright on built app)
7. **Push image** to registry (ArvanCloud Container Registry)
8. **Deploy** via SSH `git pull && docker compose pull && docker compose up -d` on staging (auto on `main` merge)
9. **Production deploy:** manual workflow trigger after staging soak time

## Containerization
- Multi-stage `Dockerfile`: `deps → build → runner` with non-root user.
- `docker-compose.yml` for local: app + Postgres + Redis + (optional) MinIO.
- `docker-compose.prod.yml` for VM deployment.

## Monitoring stack
- **Metrics:** Prometheus + node_exporter + custom app metrics (Next.js OpenTelemetry).
- **Logs:** Loki + Promtail. Structured JSON via Pino.
- **Dashboards:** Grafana (preloaded with: HTTP latency, error rate, queue depth, payment phase counts).
- **Alerts:** Alertmanager → Telegram bot for Iran-friendly paging.

## Key alerts
- Payment webhook failure rate > 1% over 5 min
- Phase-2 reminder cron not run in 25 hours
- DB connection pool exhausted
- Redis memory > 80%
- 5xx rate > 1% over 5 min
- Cert expiry < 14 days

## Backup & DR
- Postgres: continuous WAL archiving to ArvanCloud Object Storage. Daily full snapshot. Weekly tested restore in staging.
- Object storage: cross-region replication to Hetzner EU.
- RTO: 1 hour. RPO: 5 minutes.

## Cron jobs
| Job | Schedule | Purpose |
|---|---|---|
| `phase2-reminder` | hourly | Email + SMS reminders for awaiting_phase2 orders |
| `phase2-overdue` | every 30 min | Transition expired awaiting_phase2 → phase2_overdue |
| `shipment-sync` | every 6 h | Pull tracking from freight forwarder APIs |
| `db-backup` | daily 03:00 | Verify last night's WAL backup |

Implemented as Next.js API routes hit by an external scheduler (ArvanCloud Functions or systemd timer) with HMAC-signed authentication.

## Cost ceiling (initial)
~7M IRR/month. Re-evaluate quarterly.
