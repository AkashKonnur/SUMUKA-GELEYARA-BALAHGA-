/**
 * Persistent data layer — Dual-Engine (MongoDB Atlas Cloud + Local JSON Sync).
 *
 * ARCHITECTURE:
 * 1. Primary Cloud Storage: MongoDB Atlas (when MONGODB_URI is configured).
 *    Guarantees permanent data persistence across all Render sleep/restart/redeploy cycles.
 * 2. Local Sync / Fallback: File-based JSON storage in DATA_DIR (default: ./data/).
 *    Guarantees that local development, offline mode, and zero-config testing always work
 *    and survive browser refreshes (Ctrl+R) and server restarts.
 * 3. Default Fallback: fallbackData.js values when both storage engines are clean/empty.
 *
 * Collections:
 *   announcements → array of announcements
 *   events        → array of day objects (Day 1, 2, 3)
 *   gallery       → array of photo objects
 *   journey       → array of 11-year milestone objects
 *   donationLog   → array of donation transaction records
 *   siteInfo      → single document (about story, hero text, contacts, background image)
 *   donation      → single document (UPI ID, QR URL, instructions)
 *   location      → single document (address, map notes)
 */

import fs from "fs";
import path from "path";
import clientPromise from "./db.js";
import {
  fallbackSiteInfo,
  fallbackEvents,
  fallbackAnnouncements,
  fallbackJourney,
  fallbackDonation,
  fallbackLocation,
} from "./fallbackData.js";

const DB_NAME = "sumuka";
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

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

// ─── LOCAL FILE SYSTEM HELPERS ──────────────────────────────────────────────────

function ensureLocalDir() {
  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ DATA_DIR)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("[data] Failed to create local data directory:", err);
  }
}

function readLocalFile(name) {
  try {
    ensureLocalDir();
    const filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) return null;
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf8");
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[data] Error reading local file ${name}.json:`, err);
    return null;
  }
}

function writeLocalFile(name, data) {
  try {
    ensureLocalDir();
    const filePath = path.join(DATA_DIR, `${name}.json`);
    fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`[data] Error writing local file ${name}.json:`, err);
  }
}

// ─── MONGODB HELPERS ────────────────────────────────────────────────────────────

async function getCollection(name) {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    if (!client) return null;
    return client.db(DB_NAME).collection(name);
  } catch (err) {
    console.warn(`[data] MongoDB connection warning for ${name}:`, err.message);
    return null;
  }
}

// ─── PUBLIC READ / WRITE METHODS ───────────────────────────────────────────────

/**
 * Read a collection.
 * Tries MongoDB first; if not configured or empty, tries local JSON file; then fallback defaults.
 */
export async function readData(name) {
  // 1. Try reading from MongoDB Atlas (if configured)
  try {
    const col = await getCollection(name);
    if (col) {
      if (ARRAY_COLLECTIONS.includes(name)) {
        let sort = {};
        if (name === "donationLog") sort = { createdAt: -1 };
        else if (name === "journey") sort = { year: 1, order: 1 };
        else if (name === "events") sort = { dayNumber: 1 };

        const docs = await col.find({}, { projection: { _id: 0 } }).sort(sort).toArray();
        if (Array.isArray(docs) && docs.length > 0) {
          // Keep local file in sync
          writeLocalFile(name, docs);
          return docs;
        }
      } else if (OBJECT_COLLECTIONS.includes(name)) {
        const doc = await col.findOne({ _id: "singleton" }, { projection: { _id: 0 } });
        if (doc && Object.keys(doc).length > 0) {
          // Keep local file in sync
          writeLocalFile(name, doc);
          return doc;
        }
      }
    }
  } catch (err) {
    console.warn(`[data] MongoDB read failed for ${name}, falling back to local file:`, err.message);
  }

  // 2. Fallback to local JSON file
  const localData = readLocalFile(name);
  if (localData !== null) {
    if (ARRAY_COLLECTIONS.includes(name) && Array.isArray(localData) && localData.length > 0) {
      return localData;
    }
    if (OBJECT_COLLECTIONS.includes(name) && localData && Object.keys(localData).length > 0) {
      return localData;
    }
  }

  // 3. Fallback to defaults
  return DEFAULTS[name] ?? (ARRAY_COLLECTIONS.includes(name) ? [] : {});
}

/**
 * Bulk write / replace a collection.
 * Writes to local JSON file AND MongoDB Atlas (if available).
 */
export async function writeData(name, data) {
  // 1. Always write to local JSON file first (guarantees local survival)
  writeLocalFile(name, data);

  // 2. Persist to MongoDB Atlas (if configured)
  try {
    const col = await getCollection(name);
    if (col) {
      if (ARRAY_COLLECTIONS.includes(name)) {
        const items = Array.isArray(data) ? data : [];
        await col.deleteMany({});
        if (items.length > 0) {
          const docs = items.map(({ _id, ...rest }) => rest);
          await col.insertMany(docs);
        }
      } else if (OBJECT_COLLECTIONS.includes(name)) {
        const { _id, ...fields } = data;
        await col.replaceOne(
          { _id: "singleton" },
          { _id: "singleton", ...fields, updatedAt: new Date().toISOString() },
          { upsert: true }
        );
      }
    }
  } catch (err) {
    console.warn(`[data] MongoDB write failed for ${name} (local file was saved):`, err.message);
  }
}

/**
 * Append a single item to an array collection.
 */
export async function appendItem(name, item) {
  const current = (await readData(name)) || [];
  const { _id, ...cleanItem } = item;
  const updated = [cleanItem, ...(Array.isArray(current) ? current : [])];

  // Write to both storage engines
  await writeData(name, updated);
  return cleanItem;
}

/**
 * Delete a single item by its `id` field from an array collection.
 */
export async function deleteItem(name, id) {
  const current = (await readData(name)) || [];
  const updated = Array.isArray(current) ? current.filter((item) => String(item.id) !== String(id)) : [];

  // Write to both storage engines
  await writeData(name, updated);
}

/**
 * Merge-update a single-object collection (shallow merge).
 */
export async function mergeData(name, patch) {
  const current = (await readData(name)) || DEFAULTS[name] || {};
  const { _id, ...cleanPatch } = patch;
  const updated = {
    ...current,
    ...cleanPatch,
    updatedAt: new Date().toISOString(),
  };

  // Write to both storage engines
  await writeData(name, updated);
  return updated;
}
