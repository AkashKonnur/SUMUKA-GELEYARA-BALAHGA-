/**
 * Persistent data layer — MongoDB Atlas.
 *
 * Replaces the previous ephemeral file-based JSON storage.
 * Data is stored in MongoDB and survives all Render restarts/redeploys/sleep cycles.
 *
 * Collections map:
 *   announcements  → array of documents
 *   events         → array of day documents
 *   gallery        → array of photo documents
 *   journey        → array of year documents
 *   donationLog    → array of donation records
 *   siteInfo       → single document (stored as { _id: "singleton", ...fields })
 *   donation       → single document
 *   location       → single document
 *
 * Fallback behaviour:
 *   If MONGODB_URI is not set, or if a DB read fails, the function returns
 *   fallbackData.js values — exactly as before. This guarantees the public
 *   website always renders, even without a database.
 *
 * Environment variables required:
 *   MONGODB_URI — full MongoDB connection string from Atlas (or any MongoDB host)
 *
 * NOTE: File-based local JSON files (./data/*.json) are NO LONGER USED.
 *       Files in that directory can be safely deleted.
 */

import clientPromise from "./db";
import {
  fallbackSiteInfo,
  fallbackEvents,
  fallbackAnnouncements,
  fallbackJourney,
  fallbackDonation,
  fallbackLocation,
} from "./fallbackData.js";

const DB_NAME = "sumuka";

// Collections that store arrays vs. single objects
const ARRAY_COLLECTIONS = ["announcements", "gallery", "events", "journey", "donationLog"];
const OBJECT_COLLECTIONS = ["donation", "location", "siteInfo"];

// Default values used when DB is empty or unavailable
const DEFAULTS = {
  announcements: fallbackAnnouncements,
  events: fallbackEvents,
  gallery: [],
  journey: fallbackJourney,
  donationLog: [],
  donation: fallbackDonation,
  location: fallbackLocation,
  siteInfo: fallbackSiteInfo,
};

/**
 * Get a MongoDB collection handle.
 * Returns null if MONGODB_URI is not configured.
 */
async function getCollection(name) {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    return client.db(DB_NAME).collection(name);
  } catch {
    return null;
  }
}

/**
 * Read a collection from MongoDB.
 *
 * - Array collections: returns an array of documents (sorted by createdAt desc for logs)
 * - Object collections: returns the singleton document
 *
 * Returns the fallback value if DB is unavailable or collection is empty.
 */
export async function readData(name) {
  try {
    const col = await getCollection(name);
    if (!col) return DEFAULTS[name] ?? [];

    if (ARRAY_COLLECTIONS.includes(name)) {
      const sort = name === "donationLog" ? { createdAt: -1 } : {};
      const docs = await col.find({}, { projection: { _id: 0 } }).sort(sort).toArray();
      if (docs && docs.length > 0) return docs;
      return DEFAULTS[name] ?? [];
    }

    if (OBJECT_COLLECTIONS.includes(name)) {
      const doc = await col.findOne({ _id: "singleton" }, { projection: { _id: 0 } });
      if (doc && Object.keys(doc).length > 0) return doc;
      return DEFAULTS[name] ?? {};
    }

    return DEFAULTS[name] ?? [];
  } catch {
    return DEFAULTS[name] ?? [];
  }
}

/**
 * Write data to MongoDB.
 *
 * - Array collections: REPLACES the entire collection (delete-all then insert-many)
 * - Object collections: upserts the singleton document
 */
export async function writeData(name, data) {
  const col = await getCollection(name);
  if (!col) {
    // Silently ignore if DB is unavailable — admin gets an HTTP error from the API route
    throw new Error("MONGODB_URI is not configured. Cannot persist data.");
  }

  if (ARRAY_COLLECTIONS.includes(name)) {
    // Delete existing + re-insert (bulk replace)
    const items = Array.isArray(data) ? data : [];
    await col.deleteMany({});
    if (items.length > 0) {
      // Strip any _id fields before inserting (avoid duplicate key errors)
      const docs = items.map(({ _id, ...rest }) => rest);
      await col.insertMany(docs);
    }
    return;
  }

  if (OBJECT_COLLECTIONS.includes(name)) {
    const { _id, ...fields } = data;
    await col.replaceOne({ _id: "singleton" }, { _id: "singleton", ...fields }, { upsert: true });
    return;
  }
}

/**
 * Append a single item to an array collection (used by POST /api/data/[collection]).
 * More efficient than read-all → delete-all → insert-all for high-frequency writes.
 */
export async function appendItem(name, item) {
  const col = await getCollection(name);
  if (!col) throw new Error("MONGODB_URI is not configured.");
  const { _id, ...rest } = item;
  await col.insertOne(rest);
}

/**
 * Delete a single item by its `id` field from an array collection.
 */
export async function deleteItem(name, id) {
  const col = await getCollection(name);
  if (!col) throw new Error("MONGODB_URI is not configured.");
  await col.deleteOne({ id });
}

/**
 * Merge-update a single-object collection (shallow merge).
 */
export async function mergeData(name, patch) {
  const col = await getCollection(name);
  if (!col) throw new Error("MONGODB_URI is not configured.");
  await col.updateOne(
    { _id: "singleton" },
    { $set: { ...patch, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return readData(name);
}
