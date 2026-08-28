import { NextResponse } from "next/server";
import { appendItem } from "@/lib/data";

/**
 * POST /api/donations
 * Public endpoint — records a donation initiation event.
 *
 * Called from the public Donation component when a user clicks "Pay via UPI".
 * Creates a record with status "initiated" so admins can see payment attempts
 * and manually mark them as confirmed after checking their UPI app.
 *
 * Body:
 *   { donorName?: string, amount: number, upiId: string, note?: string }
 *
 * Security: No sensitive payment data is stored. Only donor name (optional),
 * amount, and initiation timestamp. UPI PIN / card details are never touched.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { donorName, amount, upiId, note } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Valid amount is required." }, { status: 400 });
    }

    const record = {
      id: Date.now().toString(),
      donorName: (donorName || "").trim() || "Anonymous Devotee",
      amount: Number(amount),
      upiId: upiId || "",
      note: (note || "").trim() || "UPI donation via website",
      status: "initiated", // Admin manually updates to "confirmed" after verification
      loggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await appendItem("donationLog", record);
    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error("POST /api/donations error:", err);
    return NextResponse.json(
      { error: "Failed to record donation. Please try again." },
      { status: 500 }
    );
  }
}
