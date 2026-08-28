/**
 * MongoDB connection singleton for Next.js.
 *
 * Reuses a single MongoClient across requests in development (where modules
 * are hot-reloaded) and in production (where serverless functions can share
 * the same Node.js process via the connection pool).
 *
 * Usage:
 *   import clientPromise from "@/lib/db";
 *   const client = await clientPromise;
 *   const db = client.db("sumuka");
 */

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  // Not a fatal error at import time — readData / writeData handle the fallback.
  // We just log a warning so it is visible in server logs.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[db] MONGODB_URI is not set. Data will fall back to fallbackData.js (NOT persisted)."
    );
  }
}

/** @type {MongoClient | undefined} */
let client;
/** @type {Promise<MongoClient> | undefined} */
let clientPromise;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In dev, use a global variable to preserve the connection across HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, create a new MongoClient (connection pooled per instance).
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
