import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/jwt";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { requireXRequestedWith } from "@/lib/auth/csrf";

export async function POST(req: Request) {
  const csrfError = requireXRequestedWith(req);
  if (csrfError) return csrfError;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sr_refresh")?.value;
    if (!token) {
      return NextResponse.json({ error: "NO_REFRESH_TOKEN" }, { status: 401 });
    }

    const payload = await verifyRefreshToken(token);
    if (!payload.sub) {
      return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 401 });
    }

    const accessToken = await signAccessToken({ sub: user.id, role: user.role });

    return NextResponse.json({
      user: { id: user.id, phone: user.phone, role: user.role, name: user.name },
      accessToken,
    });
  } catch {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }
}
