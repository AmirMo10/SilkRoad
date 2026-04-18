import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOtp, AuthError } from "@/server/services/auth.service";
import { redis } from "@/server/redis";
import { requireXRequestedWith } from "@/lib/auth/csrf";

/** Max 1 OTP per 60 seconds per phone number. */
const RATE_LIMIT_WINDOW_SECONDS = 60;
/** Max 5 OTPs per hour per phone number. */
const RATE_LIMIT_HOURLY_MAX = 5;
const RATE_LIMIT_HOUR_SECONDS = 60 * 60;

const schema = z.object({
  phone: z.string().regex(/^[\d+\u06F0-\u06F9\s\-()]{10,15}$/),
});

const perMinuteKey = (phone: string) => `otp:rl:min:${phone}`;
const perHourKey = (phone: string) => `otp:rl:hour:${phone}`;

async function checkRateLimit(phone: string): Promise<NextResponse | null> {
  // 1-per-60-seconds window
  const minKey = perMinuteKey(phone);
  const minCount = await redis.incr(minKey);
  if (minCount === 1) {
    await redis.expire(minKey, RATE_LIMIT_WINDOW_SECONDS);
  }
  if (minCount > 1) {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: "Please wait 60 seconds before requesting another OTP." },
      { status: 429 },
    );
  }

  // 5-per-hour window
  const hourKey = perHourKey(phone);
  const hourCount = await redis.incr(hourKey);
  if (hourCount === 1) {
    await redis.expire(hourKey, RATE_LIMIT_HOUR_SECONDS);
  }
  if (hourCount > RATE_LIMIT_HOURLY_MAX) {
    return NextResponse.json(
      { error: "RATE_LIMITED", message: "Too many OTP requests. Please try again in an hour." },
      { status: 429 },
    );
  }

  return null;
}

export async function POST(req: Request) {
  const csrfError = requireXRequestedWith(req);
  if (csrfError) return csrfError;

  try {
    const body = schema.parse(await req.json());

    const rateLimitError = await checkRateLimit(body.phone);
    if (rateLimitError) return rateLimitError;

    await sendOtp(body.phone);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.code }, { status: 400 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
