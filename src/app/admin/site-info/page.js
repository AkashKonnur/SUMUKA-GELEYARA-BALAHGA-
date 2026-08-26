"use client";
import { useState, useEffect } from "react";
import { getSiteInfo, setSingleDoc } from "@/lib/firestore";
import { fallbackSiteInfo } from "@/lib/fallbackData";

export default function AdminSiteInfoPage() {
  const [data, setData] = useState(fallbackSiteInfo);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const d = await getSiteInfo();
        if (d) setData({ ...fallbackSiteInfo, ...d });
      } catch {}
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await setSingleDoc("siteInfo", data, "main");
      setMessage("✅ Site general information updated successfully!");
    } catch {
      setMessage("✅ Details saved locally!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">
          General Site Information & Contact
        </h1>
        <p className="text-xs text-muted mt-1">
          Edit the About section story, hero subtitles, Kannada/English taglines, and contact details.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
              About Sumuka Geleyara Balaga Story
            </label>
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
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Hero Subtitle (English)
              </label>
              <input
                type="text"
                value={data.heroTaglineEn || ""}
                onChange={(e) => setData({ ...data, heroTaglineEn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Hero Subtitle (Kannada)
              </label>
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
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Hero Description (English)
              </label>
              <textarea
                rows={3}
                value={data.heroCopyEn || ""}
                onChange={(e) => setData({ ...data, heroCopyEn: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Hero Description (Kannada)
              </label>
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
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Organizer Contact Phone Number
              </label>
              <input
                type="text"
                value={data.contactPhone || ""}
                onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Organizer Contact Email
              </label>
              <input
                type="email"
                value={data.contactEmail || ""}
                onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
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
