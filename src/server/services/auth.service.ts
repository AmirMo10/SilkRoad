import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users, type User } from "@/server/db/schema";
import { generateOtp, verifyOtp } from "@/lib/auth/otp";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { normalizeIranianMobile } from "@/lib/persian-utils";
import { getSmsProvider } from "@/server/integrations/sms/factory";

export class AuthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function sendOtp(rawPhone: string): Promise<void> {
  const phone = normalizeIranianMobile(rawPhone);
  if (!phone) throw new AuthError("INVALID_PHONE", "Invalid Iranian mobile number");

  const code = await generateOtp(phone);
  const sms = getSmsProvider();
  await sms.send({
    to: phone,
    text: `کد ورود راه ابریشم: ${code}\nاین کد تا ۵ دقیقه معتبر است.`,
  });
}

export async function verifyOtpAndLogin(rawPhone: string, code: string) {
  const phone = normalizeIranianMobile(rawPhone);
  if (!phone) throw new AuthError("INVALID_PHONE", "Invalid Iranian mobile number");

  const ok = await verifyOtp(phone, code);
  if (!ok) throw new AuthError("INVALID_OTP", "Invalid or expired OTP");

  // Find or create user
  let user: User | undefined = (await db.select().from(users).where(eq(users.phone, phone)))[0];
  if (!user) {
    [user] = await db.insert(users).values({ phone, role: "buyer" }).returning();
  }

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await signRefreshToken({ sub: user.id });

  return { user, accessToken, refreshToken };
}
