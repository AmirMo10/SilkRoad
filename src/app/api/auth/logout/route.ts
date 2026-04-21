import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireXRequestedWith } from "@/lib/auth/csrf";

export async function POST(req: Request) {
  const csrfError = requireXRequestedWith(req);
  if (csrfError) return csrfError;

  const cookieStore = await cookies();
  cookieStore.delete("sr_refresh");
  return NextResponse.json({ ok: true });
}
