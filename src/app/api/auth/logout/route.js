import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/logout
 * Clears the admin session cookie.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Immediately expire
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Logout API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
