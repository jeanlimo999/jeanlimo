import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "jl_session";
const DISPATCH_COOKIE = "jl_dispatch";
const DRIVER_COOKIE = "jl_driver";
const PARTNER_COOKIE = "jl_partner";

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

type DriverPayload = {
  role: "driver";
  driverId: string;
  name: string;
  phone: string;
  exp: number;
};

type PartnerPayload = {
  role: "partner";
  partnerId: string;
  company: string;
  email: string;
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
  return sign({ clientId, email, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 });
}

export function makeDispatchToken(email: string, name: string) {
  return sign({ role: "dispatch", email, name, exp: Date.now() + 1000 * 60 * 60 * 12 } satisfies DispatchPayload);
}

export function makeDriverToken(driverId: string, name: string, phone: string) {
  return sign({ role: "driver", driverId, name, phone, exp: Date.now() + 1000 * 60 * 60 * 12 } satisfies DriverPayload);
}

export function makePartnerToken(partnerId: string, company: string, email: string) {
  return sign({ role: "partner", partnerId, company, email, exp: Date.now() + 1000 * 60 * 60 * 12 } satisfies PartnerPayload);
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

export function readDriverSession(): DriverPayload | null {
  const token = cookies().get(DRIVER_COOKIE)?.value;
  if (!token) return null;
  const payload = verify<DriverPayload>(token);
  if (payload?.role !== "driver" || !payload.driverId) return null;
  return payload;
}

export function readPartnerSession(): PartnerPayload | null {
  const token = cookies().get(PARTNER_COOKIE)?.value;
  if (!token) return null;
  const payload = verify<PartnerPayload>(token);
  if (payload?.role !== "partner" || !payload.partnerId) return null;
  return payload;
}

export { COOKIE, DISPATCH_COOKIE, DRIVER_COOKIE, PARTNER_COOKIE };
