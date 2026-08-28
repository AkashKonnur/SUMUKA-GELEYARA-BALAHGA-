"use client";
import { useState, useEffect } from "react";
import { fallbackSiteInfo } from "@/lib/fallbackData";

export default function AdminSiteInfoPage() {
  const [data, setData] = useState(fallbackSiteInfo);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/data/siteInfo?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const d = await res.json();
          if (d && Object.keys(d).length > 0) setData({ ...fallbackSiteInfo, ...d });
        }
      } catch (err) {
        console.error("Failed to load siteInfo:", err);
      }
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/data/siteInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save");
      }
      const updated = await res.json();
      setData(prev => ({ ...prev, ...updated }));
      setMessage("✅ Site information updated permanently! Values will persist across refreshes.");
    } catch (err) {
      setMessage(`❌ Failed to save: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">General Site Information &amp; Contact</h1>
        <p className="text-xs text-muted mt-1">Edit the About section, hero text, hero background image, and contact details.</p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">About Story</label>
            <textarea
              rows={4}
              required
              value={data.about || ""}
              onChange={(e) => setData({ ...data, about: e.target.value })}
              className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Hero Subtitle (English)</label>
              <input
                type="text"
                value={data.heroTaglineEn || ""}
                onChange={(e) => setData({ ...data, heroTaglineEn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Hero Subtitle (Kannada)</label>
              <input
                type="text"
                value={data.heroTaglineKn || ""}
                onChange={(e) => setData({ ...data, heroTaglineKn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Hero Description (English)</label>
              <textarea
                rows={3}
                value={data.heroCopyEn || ""}
                onChange={(e) => setData({ ...data, heroCopyEn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Hero Description (Kannada)</label>
              <textarea
                rows={3}
                value={data.heroCopyKn || ""}
                onChange={(e) => setData({ ...data, heroCopyKn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Contact Phone</label>
              <input
                type="text"
                value={data.contactPhone || ""}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Contact Email</label>
              <input
                type="email"
                value={data.contactEmail || ""}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">🖼️ Hero Background Image URL</label>
            <input
              type="url"
              value={data.backgroundImageUrl || ""}
              onChange={(e) => setData({ ...data, backgroundImageUrl: e.target.value })}
              placeholder="https://... (Direct image link)"
              className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
            />
            <p className="text-[0.7rem] text-muted mt-1">Paste a direct link to any image. Leave empty to use the default background.</p>
            {data.backgroundImageUrl && (
              <div className="mt-2">
                <p className="text-xs text-muted mb-1">Preview:</p>
                <img
                  src={data.backgroundImageUrl}
                  alt="Background preview"
                  className="max-h-32 rounded-lg object-cover border border-gold/30"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary !py-2.5 !px-6 text-xs font-bold disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Site Details →"}
          </button>
        </form>
      </div>
    </div>
  );
}
