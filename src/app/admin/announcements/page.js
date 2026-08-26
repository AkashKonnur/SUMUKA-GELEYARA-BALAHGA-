"use client";
import { useState, useEffect } from "react";
import {
  getAnnouncements,
  addDocument,
  deleteDocument,
} from "@/lib/firestore";
import { fallbackAnnouncements } from "@/lib/fallbackData";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAnnouncements();
        if (data && data.length) setAnnouncements(data);
      } catch {}
    }
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setMessage("");

    const newDoc = {
      text: text.trim(),
      imageUrl: imageUrl.trim() || null,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await addDocument("announcements", newDoc);
      setAnnouncements([{ id: res.id, ...newDoc }, ...announcements]);
      setText("");
      setImageUrl("");
      setMessage("✅ Announcement posted live on the website!");
    } catch {
      // Local fallback
      setAnnouncements([{ id: Date.now().toString(), ...newDoc }, ...announcements]);
      setText("");
      setImageUrl("");
      setMessage("✅ Announcement saved locally!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteDocument("announcements", id);
    } catch {}
    setAnnouncements(announcements.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">
          Live Announcements & Broadcasts
        </h1>
        <p className="text-xs text-muted mt-1">
          Post live alerts that display directly in the home page Live Updates section.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of active announcements */}
        <div className="lg:col-span-7 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">
            Active Announcements ({announcements.length})
          </h2>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-[#0f0a07] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 flex justify-between items-start hover:border-gold/30 transition-all"
              >
                <div>
                  <p className="text-xs text-[#e8dcc8] leading-relaxed">
                    {item.text}
                  </p>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Announcement attachment"
                      className="mt-2 rounded max-h-24 object-cover border border-[rgba(217,169,70,0.2)]"
                    />
                  )}
                  <span className="text-[0.65rem] text-muted block mt-2">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Active"}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-400 bg-red-950/40 hover:bg-red-900/60 px-2.5 py-1 rounded ml-4 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Post Form */}
        <div className="lg:col-span-5 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">
            📢 Post New Live Update
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Announcement Message
              </label>
              <textarea
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Maha Prasada distribution is starting now at the main counter!"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Optional Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary !py-2.5 !px-5 text-xs font-bold w-full disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Announcement Now →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
