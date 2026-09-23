import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = readSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const body = await req.json();
  const label = String(body.label || "").slice(0, 40);
  const address = String(body.address || "").slice(0, 400);
  if (!label || !address) return NextResponse.json({ error: "Label and address required" }, { status: 400 });
  const { data, error } = await db
    .from("client_addresses")
    .insert({ client_id: session.clientId, label, address })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ address: data });
}
