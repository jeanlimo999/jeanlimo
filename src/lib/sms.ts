import Telnyx from "telnyx";

const client = new Telnyx({
  apiKey: process.env.TELNYX_API_KEY,
});

const FROM = process.env.TELNYX_FROM_NUMBER || "";

export async function sendSms(to: string, text: string) {
  if (!process.env.TELNYX_API_KEY || !FROM) {
    console.warn("Telnyx not configured, skipping SMS");
    return null;
  }

  const cleaned = String(to || "").replace(/\D/g, "");
  if (cleaned.length < 10) return null;

  const number = cleaned.length === 10 ? `+1${cleaned}` : `+${cleaned}`;

  try {
    const response = await client.messages.send({
      from: FROM,
      to: number,
      text,
    });
    return response.data;
  } catch (err) {
    console.error("Telnyx SMS failed:", err);
    return null;
  }
}
