import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Lightweight health check endpoint.
 * Use a cron service (e.g. cron-job.org) to ping this URL every 10-14 minutes
 * to prevent the Render Free instance from sleeping.
 *
 * NOTE: This does NOT make ephemeral storage permanent.
 *       Data persistence is handled by MongoDB Atlas — independent of uptime.
 *
 * Returns: { status: "ok", timestamp: "ISO-string", uptime: seconds }
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "sumuka-ganeshotsava-2026",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
