import { NextResponse } from "next/server";

// Public test endpoint disabled for security.
// Anyone could previously hit this URL and trigger an SMS.
// Remove this file entirely once testing is complete, or protect it with auth if you need it again.
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Test SMS endpoint has been disabled" },
    { status: 410 }
  );
}
