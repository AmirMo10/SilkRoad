import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtpAndLogin, AuthError } from "@/server/services/auth.service";
import { requireXRequestedWith } from "@/lib/auth/csrf";

const schema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const csrfError = requireXRequestedWith(req);
  if (csrfError) return csrfError;

  try {
    const body = schema.parse(await req.json());
    const { user, accessToken, refreshToken } = await verifyOtpAndLogin(body.phone, body.code);

    const res = NextResponse.json({
      user: { id: user.id, phone: user.phone, role: user.role, name: user.name },
      accessToken,
    });
    res.cookies.set("sr_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.code }, { status: 401 });
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    return NextResponse.json({ error: "INTERNAL" }, { status: 500 });
  }
}
