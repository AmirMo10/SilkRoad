import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __silkroad_redis__: Redis | undefined;
}

const url = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = global.__silkroad_redis__ ?? new Redis(url, { lazyConnect: true });
if (process.env.NODE_ENV !== "production") global.__silkroad_redis__ = redis;
