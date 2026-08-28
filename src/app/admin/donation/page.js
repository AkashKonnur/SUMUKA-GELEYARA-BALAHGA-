"use client";
import { useState, useEffect } from "react";
import { fallbackDonation } from "@/lib/fallbackData";

export default function AdminDonationPage() {
  const [data, setData] = useState(fallbackDonation);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/data/donation?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const d = await res.json();
          if (d && Object.keys(d).length > 0) setData({ ...fallbackDonation, ...d });
        }
      } catch (err) {
        console.error("Failed to load donation settings:", err);
      }
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/data/donation", {
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
      setMessage("✅ Donation QR and UPI details updated permanently! Values will persist across refreshes.");
    } catch (err) {
      setMessage(`❌ Failed to save: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-[var(--font-heading)] text-xl text-white">Donation QR &amp; UPI Settings</h1>
        <p className="text-xs text-muted mt-1">
          Upload or replace your committee&apos;s UPI QR code and configure payment details.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">QR Code Image URL</label>
              <input
                type="url"
                value={data.qrImageUrl || ""}
                onChange={(e) => setData({ ...data, qrImageUrl: e.target.value })}
                placeholder="https://... (Direct image link to your UPI QR)"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
              <p className="text-[0.7rem] text-muted mt-1">Paste a direct link to your QR image (hosted on Google Drive, Imgur, Cloudinary, etc.)</p>
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">UPI ID</label>
              <input
                type="text"
                value={data.upiId || ""}
                onChange={(e) => setData({ ...data, upiId: e.target.value })}
                placeholder="sumukabalaga@upi"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Account / Committee Display Name</label>
              <input
                type="text"
                value={data.upiName || ""}
                onChange={(e) => setData({ ...data, upiName: e.target.value })}
                placeholder="Sumuka Geleyara Balaga"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Instructions / Note for Donors</label>
              <textarea
                rows={3}
                value={data.instructions || ""}
                onChange={(e) => setData({ ...data, instructions: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary !py-2.5 !px-6 text-xs font-bold disabled:opacity-50">
              {loading ? "Saving..." : "Save Donation Settings →"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6 text-center">
          <h2 className="text-xs font-bold text-gold-light tracking-wider uppercase mb-4">Live Preview</h2>
          <div className="bg-white rounded-xl p-4 inline-block shadow-lg max-w-[240px]">
            {data.qrImageUrl ? (
              <img
                src={data.qrImageUrl}
                alt="QR Preview"
                className="w-full h-auto object-contain max-h-52"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                No QR code set
              </div>
            )}
          </div>
          <div className="mt-4 text-xs text-[#cfc0ab]">
            <p className="font-mono font-bold text-white">{data.upiId || "No UPI ID set"}</p>
            <p className="text-muted text-[0.7rem]">{data.upiName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
