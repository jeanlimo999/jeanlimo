import { NextRequest, NextResponse } from "next/server";
// fixed version
export async function POST() { return NextResponse.json({ error: "fixed" }); }
