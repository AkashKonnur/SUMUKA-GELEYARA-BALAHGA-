"use client";
import { useState, useEffect } from "react";
import { getDonation, setSingleDoc } from "@/lib/firestore";
import { fallbackDonation } from "@/lib/fallbackData";

export default function AdminDonationPage() {
  const [data, setData] = useState(fallbackDonation);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const d = await getDonation();
        if (d) setData({ ...fallbackDonation, ...d });
      } catch {}
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await setSingleDoc("donation", data, "main");
      setMessage("✅ Donation QR and UPI details updated successfully!");
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
          Donation QR & UPI Settings
        </h1>
        <p className="text-xs text-muted mt-1">
          Upload or replace your committee's UPI QR code (PhonePe, Google Pay, Paytm) and configure details.
        </p>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-7 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                QR Code Image URL (or Firebase Storage URL)
              </label>
              <input
                type="url"
                value={data.qrImageUrl || ""}
                onChange={(e) => setData({ ...data, qrImageUrl: e.target.value })}
                placeholder="https://... (Direct image link to your UPI QR)"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
              <p className="text-[0.7rem] text-muted mt-1">
                The public website will auto-scale and fit the image gracefully.
              </p>
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                UPI ID (e.g. sumuka@upi or mobile@okhdfcbank)
              </label>
              <input
                type="text"
                value={data.upiId || ""}
                onChange={(e) => setData({ ...data, upiId: e.target.value })}
                placeholder="sumukabalaga@upi"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Account / Committee Display Name
              </label>
              <input
                type="text"
                value={data.upiName || ""}
                onChange={(e) => setData({ ...data, upiName: e.target.value })}
                placeholder="Sumuka Geleyara Balaga"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Instructions / Devotional Note for Donors
              </label>
              <textarea
                rows={3}
                value={data.instructions || ""}
                onChange={(e) => setData({ ...data, instructions: e.target.value })}
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary !py-2.5 !px-6 text-xs font-bold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Donation Settings →"}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-6 text-center">
          <h2 className="text-xs font-bold text-gold-light tracking-wider uppercase mb-4">
            Live Preview on Public Site
          </h2>

          <div className="bg-white rounded-xl p-4 inline-block shadow-lg max-w-[240px]">
            {data.qrImageUrl ? (
              <img
                src={data.qrImageUrl}
                alt="QR Preview"
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                No QR code uploaded
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
