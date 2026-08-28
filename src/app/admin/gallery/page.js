"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/data/gallery?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPhotos(data);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      }
    }
    load();
  }, []);

  async function handleAddPhotoUrl(e) {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/data/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          caption: caption.trim() || "Ganeshotsava celebration moment",
          order: photos.length + 1,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to add photo");
      }
      const newPhoto = await res.json();
      setPhotos((prev) => [...prev, newPhoto]);
      setImageUrl("");
      setCaption("");
      setMessage("✅ Photo URL added permanently! It will persist across refreshes.");
    } catch (err) {
      setMessage(`❌ Failed to add photo: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage("");

    try {
      // Upload the file
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setMessage(`❌ Upload failed: ${uploadData.error || "Unknown error"}`);
        return;
      }

      // Save to gallery collection
      const res = await fetch("/api/data/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadData.url,
          caption: caption.trim() || "Ganeshotsava celebration moment",
          order: photos.length + 1,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save photo record");
      }
      const newPhoto = await res.json();
      setPhotos((prev) => [...prev, newPhoto]);
      setCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage("✅ Photo uploaded and saved permanently!");
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to remove this photo?")) return;
    try {
      const res = await fetch(`/api/data/gallery?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPhotos((prev) => prev.filter((p) => String(p.id) !== String(id)));
      setMessage("✅ Photo removed permanently.");
    } catch (err) {
      setMessage(`❌ Failed to delete: ${err.message || "Please try again."}`);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">Photo Gallery Manager</h1>
        <p className="text-xs text-muted mt-1">
          Upload photos directly or paste image URLs. Changes appear on the public website immediately.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery Grid Preview */}
        <div className="lg:col-span-8 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">
            Current Gallery Photos ({photos.length})
          </h2>

          {photos.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted border border-dashed border-[rgba(217,169,70,0.2)] rounded-lg">
              No photos added yet. Add image URLs or upload files using the form on the right.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="bg-[#0f0a07] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden group relative">
                  <img
                    src={p.imageUrl}
                    alt={p.caption || "Gallery"}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.currentTarget.src = '/assets/ganesha-hero.png'; }}
                  />
                  <div className="p-2.5">
                    <p className="text-[0.75rem] text-[#cfc0ab] truncate">{p.caption}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute top-2 right-2 bg-red-950/80 hover:bg-red-900 text-red-200 text-[0.65rem] px-2 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Form */}
        <div className="lg:col-span-4 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">➕ Add Photo to Gallery</h2>

          {/* Mode Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-[rgba(217,169,70,0.2)] mb-5">
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`flex-1 py-2 text-[0.72rem] font-semibold transition-colors ${
                uploadMode === "url"
                  ? "bg-gold text-maroon-deep font-bold"
                  : "bg-transparent text-[#cfc0ab] hover:bg-gold/10"
              }`}
            >
              📎 Paste Image URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex-1 py-2 text-[0.72rem] font-semibold transition-colors ${
                uploadMode === "file"
                  ? "bg-gold text-maroon-deep font-bold"
                  : "bg-transparent text-[#cfc0ab] hover:bg-gold/10"
              }`}
            >
              📁 Upload File
            </button>
          </div>

          {uploadMode === "url" ? (
            <form onSubmit={handleAddPhotoUrl} className="space-y-4">
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                  Image URL (Public direct link)
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (e.g. from Google Drive, Imgur, Cloudinary)"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Photo Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Maha Aarti with devotees"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary !py-2.5 !px-5 text-xs font-bold w-full disabled:opacity-50">
                {loading ? "Adding..." : "Add Photo URL →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                  Upload Image File (max 10MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  required
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold/20 file:text-gold-light hover:file:bg-gold/30 file:cursor-pointer"
                />
                <p className="text-[0.7rem] text-muted mt-1">
                  💡 Note: Direct image URLs (Google Drive / Imgur / Cloudinary) are recommended for 100% cloud permanence.
                </p>
              </div>

              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Photo Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Maha Aarti with devotees"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary !py-2.5 !px-5 text-xs font-bold w-full disabled:opacity-50">
                {loading ? "Uploading..." : "Upload & Add to Gallery →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
