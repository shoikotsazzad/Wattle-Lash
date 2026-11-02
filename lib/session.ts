// Signed session token (HMAC-SHA256). No DB access, so proxy.ts can use it too.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "wl_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { uid: string; role: "customer" | "admin"; v: number; exp: number };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET is not set (min 16 chars)");
  return s;
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function createToken(p: Omit<SessionPayload, "exp">) {
  const payload: SessionPayload = { ...p, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token || !process.env.AUTH_SECRET) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const p = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    return p.exp > Date.now() / 1000 ? p : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (token: string) => ({
  name: SESSION_COOKIE,
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
});
