import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  if (!key) return NextResponse.json({ error: "Maps key missing" }, { status: 500 });
  return NextResponse.json({ key });
}
