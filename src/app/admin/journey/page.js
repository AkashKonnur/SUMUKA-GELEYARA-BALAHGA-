"use client";
import { useState, useEffect } from "react";
import { getJourney, setSingleDoc } from "@/lib/firestore";
import { fallbackJourney } from "@/lib/fallbackData";

export default function AdminJourneyPage() {
  const [journey, setJourney] = useState(fallbackJourney);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getJourney();
        if (data && data.length) setJourney(data);
      } catch {}
    }
    load();
  }, []);

  const activeCard = journey[selectedIdx] || journey[0];

  function handleUpdateCurrent(field, value) {
    const updated = [...journey];
    updated[selectedIdx] = { ...updated[selectedIdx], [field]: value };
    setJourney(updated);
  }

  async function handleSaveAll() {
    setSaving(true);
    setMessage("");
    try {
      for (let i = 0; i < journey.length; i++) {
        await setSingleDoc("journey", journey[i], `year_${journey[i].year}`);
      }
      setMessage("✅ 11-Year Journey saved successfully!");
    } catch {
      setMessage("⚠️ Saved locally (check Firebase configuration).");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-[var(--font-heading)] text-xl text-white">
            11-Year Journey Editor
          </h1>
          <p className="text-xs text-muted mt-1">
            Customize the photos and taglines for all 10 past years and the 11th year celebration.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save All Years"}
        </button>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      {/* Year Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {journey.map((item, idx) => (
          <button
            key={item.year}
            onClick={() => setSelectedIdx(idx)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 cursor-pointer border transition-all ${
              selectedIdx === idx
                ? "bg-gold text-maroon-deep border-gold font-bold"
                : "bg-[#180f0a] text-[#cfc0ab] border-[rgba(217,169,70,0.2)] hover:border-gold"
            }`}
          >
            {item.year === 2026 ? "★ 2026 (11th)" : `${item.year}`}
          </button>
        ))}
      </div>

      {/* Edit Form */}
      <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6 max-w-2xl">
        <h2 className="text-sm font-semibold text-gold-light mb-4">
          Editing Details for Year {activeCard.year} ({selectedIdx + 1} of 11)
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
              Year Tagline & Memory Description
            </label>
            <textarea
              rows={3}
              value={activeCard.tagline || ""}
              onChange={(e) => handleUpdateCurrent("tagline", e.target.value)}
              className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
              Photo URL for this year (Optional)
            </label>
            <input
              type="url"
              value={activeCard.photo || ""}
              onChange={(e) => handleUpdateCurrent("photo", e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
            />
          </div>

          {activeCard.photo && (
            <div>
              <p className="text-xs text-muted mb-1">Preview:</p>
              <img
                src={activeCard.photo}
                alt={`Year ${activeCard.year}`}
                className="max-h-40 rounded-lg object-cover border border-gold/30"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
