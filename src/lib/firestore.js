import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, onSnapshot, setDoc, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// ── Generic Helpers ───────────────────────────────────────
export async function getCollection(name, sortField = "order") {
  try {
    const q = query(collection(db, name), orderBy(sortField, "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export async function getSingleDoc(collectionName, docId = "main") {
  try {
    const snap = await getDoc(doc(db, collectionName, docId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch {
    return null;
  }
}

export async function setSingleDoc(collectionName, data, docId = "main") {
  await setDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function addDocument(collectionName, data) {
  return await addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });
}

export async function updateDocument(collectionName, docId, data) {
  await updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(collectionName, docId) {
  await deleteDoc(doc(db, collectionName, docId));
}

// ── Real-time Listener ────────────────────────────────────
export function subscribeToCollection(name, callback, sortField = "createdAt") {
  const q = query(collection(db, name), orderBy(sortField, "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

// ── Specific Getters (with fallback data) ─────────────────
export async function getEvents() {
  return await getCollection("events", "dayNumber");
}

export async function getAnnouncements() {
  try {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export async function getGallery() {
  return await getCollection("gallery", "order");
}

export async function getJourney() {
  return await getCollection("journey", "year");
}

export async function getDonation() {
  return await getSingleDoc("donation");
}

export async function getLocation() {
  return await getSingleDoc("location");
}

export async function getSiteInfo() {
  return await getSingleDoc("siteInfo");
}

export async function getDonationLog() {
  try {
    const q = query(collection(db, "donationLog"), orderBy("loggedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}
