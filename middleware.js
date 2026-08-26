import { NextResponse } from "next/server";

/**
 * Middleware to protect /admin/* routes.
 * Redirects to /admin/login if the admin_session cookie is not set.
 *
 * The login page itself (/admin/login) is always accessible.
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /admin/login itself)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");

    if (!session || session.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      // Pass the original URL so we can redirect back after login (optional)
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all /admin routes
  matcher: ["/admin", "/admin/:path*"],
};
