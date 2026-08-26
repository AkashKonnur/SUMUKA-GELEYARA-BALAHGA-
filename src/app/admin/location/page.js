"use client";
import { useState, useEffect } from "react";
import { fallbackLocation } from "@/lib/fallbackData";

export default function AdminLocationPage() {
  const [data, setData] = useState(fallbackLocation);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/data/location");
        const d = await res.json();
        if (d && Object.keys(d).length > 0) setData({ ...fallbackLocation, ...d });
      } catch {}
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/data/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setMessage("✅ Location address updated successfully on live map!");
    } catch {
      setMessage("❌ Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const encodedAddress = encodeURIComponent(data.address || "");
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">Event Venue &amp; Map Settings</h1>
        <p className="text-xs text-muted mt-1">Update the address for the public venue map.</p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Full Street Address</label>
              <textarea
                rows={3}
                required
                value={data.address || ""}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="158/78, Valagerahalli, Subash Nagar, Kengeri Satellite Town, Bengaluru, Karnataka 560060"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Venue Note / Landmark Info</label>
              <input
                type="text"
                value={data.mapNote || ""}
                onChange={(e) => setData({ ...data, mapNote: e.target.value })}
                placeholder="Near Subhash Nagar Park"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary !py-2.5 !px-6 text-xs font-bold disabled:opacity-50">
              {loading ? "Updating..." : "Save Location Settings →"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-6 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6">
          <h2 className="text-xs font-bold text-gold-light tracking-wider uppercase mb-3">Map Preview</h2>
          <div className="h-64 rounded-xl overflow-hidden border border-gold/30">
            <iframe title="Map Preview" src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
          </div>
          <p className="text-[0.7rem] text-muted mt-2">{data.address}</p>
        </div>
      </div>
    </div>
  );
}
