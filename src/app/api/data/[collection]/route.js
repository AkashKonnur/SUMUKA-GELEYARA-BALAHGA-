import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readData, writeData, appendItem, deleteItem, mergeData } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Collections that store arrays of items
const ARRAY_COLLECTIONS = ["announcements", "gallery", "events", "journey", "donationLog"];
// Collections that store a single object
const OBJECT_COLLECTIONS = ["donation", "location", "siteInfo"];

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

/**
 * GET /api/data/[collection]
 * Public — reads and returns the collection data with zero caching.
 */
export async function GET(request, { params }) {
  const { collection } = await params;

  if (![...ARRAY_COLLECTIONS, ...OBJECT_COLLECTIONS].includes(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404, headers: NO_CACHE_HEADERS });
  }

  try {
    const data = await readData(collection);
    return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error(`GET /api/data/${collection} error:`, err);
    return NextResponse.json({ error: "Failed to read data." }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

/**
 * POST /api/data/[collection]
 * Protected — adds a new item (array collections) or updates (object collections).
 */
export async function POST(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  const body = await request.json();

  try {
    let result;
    if (OBJECT_COLLECTIONS.includes(collection)) {
      result = await mergeData(collection, body);
    } else if (ARRAY_COLLECTIONS.includes(collection)) {
      const newItem = {
        ...body,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      result = await appendItem(collection, newItem);
    } else {
      return NextResponse.json({ error: "Unknown collection." }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    // Immediately revalidate the public pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json(result, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error(`POST /api/data/${collection} error:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to save data." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * PUT /api/data/[collection]
 * Protected — replaces the entire collection (used for bulk saves like events/journey).
 */
export async function PUT(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  const body = await request.json();

  try {
    await writeData(collection, body);

    // Immediately revalidate the public pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error(`PUT /api/data/${collection} error:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to save data." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * DELETE /api/data/[collection]?id=xxx
 * Protected — removes an item by id from an array collection.
 */
export async function DELETE(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: NO_CACHE_HEADERS });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  if (!ARRAY_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Cannot delete from object collection." }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  try {
    await deleteItem(collection, id);

    // Immediately revalidate the public pages
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error(`DELETE /api/data/${collection} error:`, err);
    return NextResponse.json(
      { error: err.message || "Failed to delete item." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
