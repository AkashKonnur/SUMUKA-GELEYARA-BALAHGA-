/**
 * Server-side file-based JSON storage.
 * Data is stored in JSON files inside the DATA_DIR directory.
 * Default: <project_root>/data/
 * On Render with persistent disk: set DATA_DIR=/data env var and mount disk there.
 */

import fs from "fs";
import path from "path";
import { fallbackSiteInfo, fallbackEvents, fallbackAnnouncements, fallbackJourney, fallbackDonation, fallbackLocation } from "./fallbackData.js";

// Where data files are stored. Override with DATA_DIR env var for Render persistent disk.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

// Default data for each collection
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

function ensureDir() {
  if (!fs.existsSync(/*turbopackIgnore: true*/ DATA_DIR)) {
    fs.mkdirSync(/*turbopackIgnore: true*/ DATA_DIR, { recursive: true });
  }
}

/**
 * Read a collection (array) or single-doc (object) from disk.
 */
export function readData(name) {
  try {
    ensureDir();
    const file = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(/*turbopackIgnore: true*/ file)) return DEFAULTS[name] ?? [];
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ file, "utf8");
    return JSON.parse(raw);
  } catch {
    return DEFAULTS[name] ?? [];
  }
}

/**
 * Write a collection or single-doc to disk.
 */
export function writeData(name, data) {
  ensureDir();
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(/*turbopackIgnore: true*/ file, JSON.stringify(data, null, 2), "utf8");
}
