import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

/**
 * PATCH /api/admin/donations/[id]
 * Protected — update a donation record's status or note.
 * Body: { status?: "initiated"|"confirmed"|"cancelled", note?: string }
 */
function isAuthenticated(request) {
  const session = request.cookies.get("admin_session");
  return session?.value === "authenticated";
}

export async function PATCH(request, { params }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const logs = await readData("donationLog");
    const idx = logs.findIndex((l) => l.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    const updated = { ...logs[idx] };
    if (body.status) updated.status = body.status;
    if (body.note !== undefined) updated.note = body.note;
    if (body.donorName !== undefined) updated.donorName = body.donorName;
    if (body.amount !== undefined) updated.amount = Number(body.amount);
    updated.updatedAt = new Date().toISOString();

    logs[idx] = updated;
    await writeData("donationLog", logs);

    return NextResponse.json({ success: true, record: updated });
  } catch (err) {
    console.error("PATCH /api/admin/donations/[id] error:", err);
    return NextResponse.json({ error: "Failed to update record." }, { status: 500 });
  }
}
