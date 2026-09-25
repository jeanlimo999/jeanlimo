import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "jl_session";
const DISPATCH_COOKIE = "jl_dispatch";

type SessionPayload = {
  clientId: string;
  email: string;
  exp: number;
};

type DispatchPayload = {
  role: "dispatch";
  email: string;
  name: string;
  exp: number;
};

function secret() {
  return process.env.SESSION_SECRET || process.env.STRIPE_SECRET_KEY || "jean-limo-dev-secret";
}

function sign(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify<T extends { exp: number }>(token: string): T | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as T;
    if (!payload || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function makeSessionToken(clientId: string, email: string) {
  return sign({
    clientId,
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
  });
}

export function makeDispatchToken(email: string, name: string) {
  return sign({
    role: "dispatch",
    email,
    name,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  } satisfies DispatchPayload);
}

export function readSession(): SessionPayload | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const payload = verify<SessionPayload>(token);
  if (!payload?.clientId) return null;
  return payload;
}

export function readDispatchSession(): DispatchPayload | null {
  const token = cookies().get(DISPATCH_COOKIE)?.value;
  if (!token) return null;
  const payload = verify<DispatchPayload>(token);
  if (payload?.role !== "dispatch") return null;
  return payload;
}

export { COOKIE, DISPATCH_COOKIE };
