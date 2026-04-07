# Runbook — Deploying SilkRoad on ArvanCloud

This runbook walks through bringing SilkRoad up on a fresh ArvanCloud Ubuntu VM.

## 0. Prerequisites
- ArvanCloud account with a VM provisioned (Ubuntu 24.04 LTS, 4 vCPU / 8 GB RAM / 80 GB SSD recommended)
- Domain pointing to the VM's public IP (`silkroad.ir` for prod, `staging.silkroad.ir` for staging)
- SSH access to the VM
- (Optional but recommended) ArvanCloud Managed PostgreSQL + Managed Redis instances

## 1. VM bootstrap

```bash
ssh ubuntu@<vm-ip>
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Docker + Compose
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker

# Caddy (reverse proxy + automatic TLS)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

## 2. Clone the repo

```bash
cd /opt
sudo mkdir silkroad && sudo chown $USER:$USER silkroad
cd silkroad
git clone https://github.com/AmirMo10/SilkRoad.git .
```

## 3. Environment

```bash
cp .env.example .env.local
nano .env.local
```

Fill in:

```env
NODE_ENV=production
DATABASE_URL=postgres://silkroad:STRONG_PASSWORD@db-host:5432/silkroad
REDIS_URL=redis://redis-host:6379
JWT_SECRET=<openssl rand -hex 32>
JWT_REFRESH_SECRET=<openssl rand -hex 32>
KAVENEGAR_API_KEY=<from kavenegar dashboard>
ZARINPAL_MERCHANT_ID=<from zarinpal>
S3_ENDPOINT=https://s3.ir-thr-at1.arvanstorage.ir
S3_ACCESS_KEY=<from arvancloud>
S3_SECRET_KEY=<from arvancloud>
S3_BUCKET=silkroad-prod
```

`chmod 600 .env.local`.

## 4. Database

### Option A — ArvanCloud Managed Postgres (recommended)
Provision via ArvanCloud panel. Use the connection string in `DATABASE_URL` above.

### Option B — Self-hosted via docker-compose
```bash
docker compose up -d postgres redis
```

## 5. Run migrations + seed

```bash
npm install
npm run db:migrate
npm run db:seed   # one-time, dev/staging only
```

## 6. Build and run

### Option A — Docker (recommended)
```bash
docker build -t silkroad:latest .
docker run -d \
  --name silkroad-app \
  --restart unless-stopped \
  --env-file .env.local \
  -p 127.0.0.1:3000:3000 \
  silkroad:latest
```

### Option B — systemd
```bash
npm run build
sudo tee /etc/systemd/system/silkroad.service <<'EOF'
[Unit]
Description=SilkRoad Next.js
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/silkroad
EnvironmentFile=/opt/silkroad/.env.local
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now silkroad
```

## 7. Caddy (TLS + reverse proxy)

```bash
sudo tee /etc/caddy/Caddyfile <<'EOF'
silkroad.ir, www.silkroad.ir {
  encode gzip zstd
  reverse_proxy 127.0.0.1:3000

  header {
    Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options "nosniff"
    Referrer-Policy "strict-origin-when-cross-origin"
  }
}
EOF

sudo systemctl reload caddy
```

Caddy automatically provisions Let's Encrypt certificates.

## 8. Verify

```bash
curl -I https://silkroad.ir
# Expect: HTTP/2 200
```

Open https://silkroad.ir in a browser — you should see the gold "راه ابریشم" hero in RTL.

## 9. Backups

```bash
sudo tee /etc/cron.d/silkroad-backup <<'EOF'
0 3 * * * ubuntu pg_dump $DATABASE_URL | gzip > /var/backups/silkroad-$(date +\%F).sql.gz && find /var/backups -name 'silkroad-*.sql.gz' -mtime +14 -delete
EOF
```

For object-storage cross-region replication, configure via ArvanCloud panel.

## 10. Updates

```bash
cd /opt/silkroad
git pull origin main
npm install
npm run db:migrate
docker build -t silkroad:latest .
docker stop silkroad-app && docker rm silkroad-app
docker run -d --name silkroad-app --restart unless-stopped --env-file .env.local -p 127.0.0.1:3000:3000 silkroad:latest
```

Or wire this into a GitHub Actions deploy job that SSHes into the VM (see `009-infrastructure.md`).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| 502 from Caddy | App not running | `docker ps` / `systemctl status silkroad` |
| DB connection refused | DATABASE_URL wrong / firewall | Verify URL, check Postgres listens |
| OTP SMS not arriving | Kavenegar key missing | Set `KAVENEGAR_API_KEY` and restart |
| Persian fonts slow | next/font network blocked | Check egress; pre-cache fonts in build |
