import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const { error, data } = await db
    .from("clients")
    .update({
      full_name: String(body.full_name || "").slice(0, 120),
      phone: String(body.phone || "").slice(0, 40),
      company: String(body.company || "").slice(0, 120),
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.clientId)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}
