import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readData, writeData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

/**
 * Check if the request has a valid admin session cookie.
 */
function isAuthenticated(request) {
  const session = request.cookies.get("admin_session");
  return session?.value === "authenticated";
}

export async function PATCH(request, { params }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const logs = await readData("donationLog");
    const idx = logs.findIndex((l) => String(l.id) === String(id));
    if (idx === -1) {
      return NextResponse.json({ error: "Record not found." }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    const updated = { ...logs[idx] };
    if (body.status) updated.status = body.status;
    if (body.note !== undefined) updated.note = body.note;
    if (body.donorName !== undefined) updated.donorName = body.donorName;
    if (body.amount !== undefined) updated.amount = Number(body.amount);
    updated.updatedAt = new Date().toISOString();

    logs[idx] = updated;
    await writeData("donationLog", logs);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, record: updated }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("PATCH /api/admin/donations/[id] error:", err);
    return NextResponse.json({ error: "Failed to update record." }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
