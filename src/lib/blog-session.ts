import { createHmac, timingSafeEqual } from "crypto";

export const BLOG_COOKIE = "bs_blog_session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.BLOG_SESSION_SECRET;
  if (!secret) {
    throw new Error("BLOG_SESSION_SECRET is not set");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken() {
  const issuedAt = Date.now().toString();
  const payload = `ok:${issuedAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !process.env.BLOG_SESSION_SECRET) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const [, issuedAt] = payload.split(":");
  const ts = Number(issuedAt);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < MAX_AGE_SECONDS * 1000;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.BLOG_ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
