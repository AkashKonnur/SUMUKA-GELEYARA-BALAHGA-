import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";

// Collections that store arrays of items
const ARRAY_COLLECTIONS = ["announcements", "gallery", "events", "journey", "donationLog"];
// Collections that store a single object
const OBJECT_COLLECTIONS = ["donation", "location", "siteInfo"];

/**
 * Check if the request has a valid admin session cookie.
 */
function isAuthenticated(request) {
  const session = request.cookies.get("admin_session");
  return session?.value === "authenticated";
}

/**
 * GET /api/data/[collection]
 * Public — reads and returns the collection data.
 */
export async function GET(request, { params }) {
  const { collection } = await params;

  if (![...ARRAY_COLLECTIONS, ...OBJECT_COLLECTIONS].includes(collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  }

  const data = readData(collection);
  return NextResponse.json(data);
}

/**
 * POST /api/data/[collection]
 * Protected — adds a new item (array collections) or updates (object collections).
 * Body: the item or updated object to save.
 */
export async function POST(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();

  if (OBJECT_COLLECTIONS.includes(collection)) {
    // For single-object collections: merge with existing data
    const existing = readData(collection);
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
    writeData(collection, updated);
    return NextResponse.json(updated);
  }

  if (ARRAY_COLLECTIONS.includes(collection)) {
    // For array collections: add new item with generated id
    const existing = readData(collection);
    const newItem = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...(Array.isArray(existing) ? existing : [])];
    writeData(collection, updated);
    return NextResponse.json(newItem);
  }

  return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
}

/**
 * PUT /api/data/[collection]
 * Protected — replaces the entire collection (used for bulk saves like events/journey).
 */
export async function PUT(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  writeData(collection, body);
  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/data/[collection]?id=xxx
 * Protected — removes an item by id from an array collection.
 */
export async function DELETE(request, { params }) {
  const { collection } = await params;

  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  if (!ARRAY_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "Cannot delete from object collection." }, { status: 400 });
  }

  const existing = readData(collection);
  const updated = Array.isArray(existing) ? existing.filter((item) => item.id !== id) : existing;
  writeData(collection, updated);
  return NextResponse.json({ success: true });
}
