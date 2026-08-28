import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { appendItem } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

/**
 * POST /api/donations
 * Public endpoint — records a donation initiation event.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { donorName, amount, upiId, note } = body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Valid amount is required." }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const record = {
      id: Date.now().toString(),
      donorName: (donorName || "").trim() || "Anonymous Devotee",
      amount: Number(amount),
      upiId: upiId || "",
      note: (note || "").trim() || "UPI donation via website",
      status: "initiated",
      loggedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await appendItem("donationLog", record);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, id: record.id }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("POST /api/donations error:", err);
    return NextResponse.json(
      { error: "Failed to record donation. Please try again." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
