import { supabaseAdmin, normEmail } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/passwords";

export type Dispatcher = { id: string; email: string; name: string };

function envAccounts() {
  const rows = [
    { email: process.env.DISPATCH_EMAIL, password: process.env.DISPATCH_PASSWORD, name: process.env.DISPATCH_NAME || "Owner" },
    { email: process.env.DISPATCH_EMAIL_2, password: process.env.DISPATCH_PASSWORD_2, name: process.env.DISPATCH_NAME_2 || "Owner" },
  ];
  return rows.filter((r) => r.email && r.password) as { email: string; password: string; name: string }[];
}

export async function countDispatchers() {
  const db = supabaseAdmin();
  if (db) {
    const { count, error } = await db.from("dispatch_users").select("id", { count: "exact", head: true });
    if (!error) return count || 0;
  }
  return envAccounts().length;
}

export async function createDispatcher(email: string, password: string, name: string) {
  const db = supabaseAdmin();
  if (!db) throw new Error("Supabase is not configured");
  const row = {
    email: normEmail(email),
    name: name.trim() || "Owner",
    password_hash: hashPassword(password),
    active: true,
  };
  const { data, error } = await db.from("dispatch_users").insert(row).select("id, email, name").single();
  if (error) throw new Error(error.message);
  return data as Dispatcher;
}

export async function findDispatcher(email: string, password: string): Promise<Dispatcher | null> {
  const clean = normEmail(email);
  const db = supabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from("dispatch_users")
      .select("id, email, name, password_hash, active")
      .eq("email", clean)
      .maybeSingle();
    if (!error && data?.active && verifyPassword(password, data.password_hash)) {
      return { id: data.id, email: data.email, name: data.name };
    }
  }
  const envHit = envAccounts().find((r) => normEmail(r.email) === clean && r.password === password);
  if (envHit) return { id: "env-" + clean, email: clean, name: envHit.name };
  return null;
}
