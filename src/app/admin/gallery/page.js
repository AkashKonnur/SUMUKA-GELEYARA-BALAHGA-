"use client";
import { useState, useEffect } from "react";

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/data/gallery");
        const data = await res.json();
        if (Array.isArray(data)) setPhotos(data);
      } catch {}
    }
    load();
  }, []);

  async function handleAddPhoto(e) {
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
      const newPhoto = await res.json();
      setPhotos((prev) => [...prev, newPhoto]);
      setImageUrl("");
      setCaption("");
      setMessage("✅ Photo added to gallery!");
    } catch {
      setMessage("❌ Failed to add photo. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to remove this photo?")) return;
    try {
      await fetch(`/api/data/gallery?id=${id}`, { method: "DELETE" });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setMessage("❌ Failed to delete. Please try again.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">Photo Gallery Manager</h1>
        <p className="text-xs text-muted mt-1">
          Add image URLs to display photos in the public gallery. Use any publicly hosted image link.
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
              No photos added yet. Add image URLs using the form on the right.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="bg-[#0f0a07] border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden group relative">
                  <img src={p.imageUrl} alt={p.caption || "Gallery"} className="w-full h-32 object-cover" />
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

          <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Image URL (publicly hosted)
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
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
              {loading ? "Adding..." : "Add Photo →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
