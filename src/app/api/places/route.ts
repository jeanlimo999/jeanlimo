import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = String(req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ predictions: [] });
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return NextResponse.json({ error: "Google Maps API key is not configured", predictions: [] }, { status: 500 });
  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", q);
  url.searchParams.set("components", "country:us");
  url.searchParams.set("location", "29.7604,-95.3698");
  url.searchParams.set("radius", "80000");
  url.searchParams.set("key", key);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return NextResponse.json({ error: data.error_message || data.status, predictions: [] }, { status: 400 });
  }
  return NextResponse.json({
    predictions: (data.predictions || []).slice(0, 8).map((p: any) => p.description),
  });
}
