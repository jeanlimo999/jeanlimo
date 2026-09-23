import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = readSession();
  if (!session) return NextResponse.json({ client: null }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  const { data: client } = await db.from("clients").select("*").eq("id", session.clientId).maybeSingle();
  if (!client) return NextResponse.json({ client: null }, { status: 401 });
  const { data: addresses } = await db
    .from("client_addresses")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: true });
  return NextResponse.json({ client, addresses: addresses || [] });
}
