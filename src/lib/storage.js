import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage and return the download URL.
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., "gallery/photo1.jpg")
 * @returns {Promise<string>} Download URL
 */
export async function uploadFile(file, path) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

/**
 * Delete a file from Firebase Storage.
 * @param {string} path - Storage path
 */
export async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("File deletion failed (may not exist):", error.message);
  }
}

/**
 * Get the download URL for a file.
 * @param {string} path - Storage path
 * @returns {Promise<string>}
 */
export async function getFileUrl(path) {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
}

/**
 * Generate a unique filename with timestamp.
 * @param {string} originalName
 * @param {string} folder
 * @returns {string}
 */
export function generateStoragePath(originalName, folder = "uploads") {
  const ext = originalName.split(".").pop();
  const timestamp = Date.now();
  const safeName = originalName.replace(/[^a-zA-Z0-9.]/g, "_").toLowerCase();
  return `${folder}/${timestamp}_${safeName}`;
}
