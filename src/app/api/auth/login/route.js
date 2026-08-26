import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/auth/login
 * Server-side admin authentication using environment variable credentials.
 * Sets an HttpOnly session cookie on success.
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Read admin credentials from environment variables (server-side only — never exposed to client)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      // If env vars not set, return a clear error (Firebase Auth handles it on the client side)
      return NextResponse.json(
        {
          error:
            "Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.",
          useFirebase: true,
        },
        { status: 401 }
      );
    }

    // Compare credentials (case-insensitive email)
    const emailMatch = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const passwordMatch = password === adminPassword;

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Set HttpOnly session cookie (7 days)
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true, email: adminEmail });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
