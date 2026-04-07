import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOtp, AuthError } from "@/server/services/auth.service";

const schema = z.object({ phone: z.string().min(10).max(15) });

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
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
