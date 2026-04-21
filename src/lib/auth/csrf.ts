import { NextResponse } from "next/server";

/**
 * Validates the presence of the `x-requested-with: XMLHttpRequest` header.
 *
 * Browser cross-origin POST requests cannot set custom headers without a
 * CORS preflight, so requiring this header blocks naive CSRF attacks from
 * attacker-controlled pages while remaining transparent to our own fetch
 * calls that include the header.
 *
 * Returns a 403 NextResponse if the check fails, or null if it passes.
 */
export function requireXRequestedWith(req: Request): NextResponse | null {
  const header = req.headers.get("x-requested-with");
  if (header !== "XMLHttpRequest") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }
  return null;
}
