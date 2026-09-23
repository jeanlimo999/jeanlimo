import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export function digits(value?: string | null) {
  return String(value || "").replace(/\D/g, "");
}

export function last4(value?: string | null) {
  return digits(value).slice(-4);
}

export function normEmail(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}
