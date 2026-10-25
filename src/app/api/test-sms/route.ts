import { NextResponse } from "next/server";
import { sendSms } from "@/lib/sms";

export async function GET() {
  const to = "12819170085";
  const text = "Jean Limo Telnyx test — SMS is working.";

  const result = await sendSms(to, text);

  if (!result) {
    return NextResponse.json(
      { ok: false, error: "SMS not sent (check TELNYX_API_KEY and TELNYX_FROM_NUMBER)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, to, result });
}
