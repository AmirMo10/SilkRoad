import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";

function getSecret(name: string): Uint8Array {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`${name} env var must be set and at least 32 chars`);
  }
  return new TextEncoder().encode(value);
}

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  role: "buyer" | "company_admin" | "platform_admin";
}

export async function signAccessToken(payload: { sub: string; role: AccessTokenPayload["role"] }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("silkroad")
    .setExpirationTime(ACCESS_TTL)
    .sign(getSecret("JWT_SECRET"));
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret("JWT_SECRET"), { issuer: "silkroad" });
  return payload as AccessTokenPayload;
}

export async function signRefreshToken(payload: { sub: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("silkroad")
    .setExpirationTime(REFRESH_TTL)
    .sign(getSecret("JWT_REFRESH_SECRET"));
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getSecret("JWT_REFRESH_SECRET"), {
    issuer: "silkroad",
  });
  return payload;
}
