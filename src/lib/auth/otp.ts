import { randomInt, createHmac, timingSafeEqual } from "node:crypto";
import { redis } from "@/server/redis";

const OTP_TTL_SECONDS = 5 * 60;
const MAX_ATTEMPTS = 5;

const codeKey = (phone: string) => `otp:code:${phone}`;
const attemptsKey = (phone: string) => `otp:attempts:${phone}`;

/** Compute HMAC-SHA256 of the OTP code using the application secret. */
function hashOtp(code: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return createHmac("sha256", secret).update(code).digest("hex");
}

/** Generate a 6-digit OTP, store its HMAC-SHA256 hash in Redis with TTL. */
export async function generateOtp(phone: string): Promise<string> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await redis.set(codeKey(phone), hashOtp(code), "EX", OTP_TTL_SECONDS);
  await redis.del(attemptsKey(phone));
  return code;
}

/** Verify an OTP. Compares HMAC hashes with timing-safe equality.
 *  Increments attempt counter; locks after MAX_ATTEMPTS. */
export async function verifyOtp(phone: string, submitted: string): Promise<boolean> {
  const storedHash = await redis.get(codeKey(phone));
  if (!storedHash) return false;

  const attempts = await redis.incr(attemptsKey(phone));
  await redis.expire(attemptsKey(phone), OTP_TTL_SECONDS);
  if (attempts > MAX_ATTEMPTS) {
    await redis.del(codeKey(phone));
    return false;
  }

  const submittedHash = hashOtp(submitted);
  const storedBuf = Buffer.from(storedHash, "hex");
  const submittedBuf = Buffer.from(submittedHash, "hex");
  const ok =
    storedBuf.length === submittedBuf.length &&
    timingSafeEqual(storedBuf, submittedBuf);

  if (ok) {
    await redis.del(codeKey(phone));
    await redis.del(attemptsKey(phone));
  }
  return ok;
}
