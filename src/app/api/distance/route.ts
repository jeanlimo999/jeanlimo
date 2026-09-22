import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pickup, dropoff } = await req.json();

    if (!pickup || !dropoff) {
      return NextResponse.json({ error: "Pickup and drop-off are required" }, { status: 400 });
    }

    const key =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!key) {
      return NextResponse.json(
        { error: "Google Maps API key is not configured" },
        { status: 500 }
      );
    }

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", pickup);
    url.searchParams.set("destinations", dropoff);
    url.searchParams.set("units", "imperial");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || `Google Maps error: ${data.status}` },
        { status: 400 }
      );
    }

    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      return NextResponse.json(
        { error: "Could not calculate distance for those addresses" },
        { status: 400 }
      );
    }

    const miles = element.distance.value / 1609.344;

    return NextResponse.json({
      miles: Math.round(miles * 10) / 10,
      text: element.distance.text,
      duration: element.duration?.text || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Distance lookup failed" }, { status: 500 });
  }
}
