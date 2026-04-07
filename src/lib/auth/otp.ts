import { randomInt } from "node:crypto";
import { redis } from "@/server/redis";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

const codeKey = (phone: string) => `otp:code:${phone}`;
const attemptsKey = (phone: string) => `otp:attempts:${phone}`;

/** Generate a 6-digit OTP, store hashed in Redis with TTL. */
export async function generateOtp(phone: string): Promise<string> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await redis.set(codeKey(phone), code, "EX", OTP_TTL_SECONDS);
  await redis.del(attemptsKey(phone));
  return code;
}

/** Verify an OTP. Increments attempt counter; locks after MAX_ATTEMPTS. */
export async function verifyOtp(phone: string, submitted: string): Promise<boolean> {
  const stored = await redis.get(codeKey(phone));
  if (!stored) return false;

  const attempts = await redis.incr(attemptsKey(phone));
  await redis.expire(attemptsKey(phone), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(codeKey(phone));
    return false;
  }

  const ok = stored === submitted;
  if (ok) {
    await redis.del(codeKey(phone));
    await redis.del(attemptsKey(phone));
  }
  return ok;
}
