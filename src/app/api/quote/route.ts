import { NextRequest, NextResponse } from "next/server";
import { calculateOneWay, calculateHourly, Vehicle } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, vehicle, miles, hours } = body;

    if (!vehicle || !["sedan", "suv", "sprinter"].includes(vehicle)) {
      return NextResponse.json({ error: "Invalid vehicle" }, { status: 400 });
    }

    let result;
    if (type === "hourly") {
      const h = Number(hours) || 2;
      result = calculateHourly(vehicle as Vehicle, h);
    } else {
      const m = Number(miles);
      if (!m || m <= 0) {
        return NextResponse.json({ error: "Valid miles required" }, { status: 400 });
      }
      result = calculateOneWay(vehicle as Vehicle, m);
    }

    // In production you would store this quote in DB/Redis with an ID and expiry
    const quoteId = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return NextResponse.json({
      success: true,
      quoteId,
      price: result.price,
      currency: "usd",
      breakdown: result.breakdown,
      vehicle,
      type: type || "oneway",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Quote failed" }, { status: 500 });
  }
}
