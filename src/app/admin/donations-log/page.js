"use client";
import { useState, useEffect } from "react";

export default function AdminDonationsLogPage() {
  const [logs, setLogs] = useState([]);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/data/donationLog");
        const data = await res.json();
        if (Array.isArray(data)) setLogs(data);
      } catch {}
    }
    load();
  }, []);

  async function handleAddLog(e) {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/data/donationLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim() || "Anonymous Devotee",
          amount: parseFloat(amount),
          note: note.trim() || "General seva contribution",
          loggedAt: new Date().toISOString(),
        }),
      });
      const newLog = await res.json();
      setLogs((prev) => [newLog, ...prev]);
      setDonorName("");
      setAmount("");
      setNote("");
      setMessage("✅ Donation entry recorded privately!");
    } catch {
      setMessage("❌ Failed to record. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    try {
      await fetch(`/api/data/donationLog?id=${id}`, { method: "DELETE" });
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setMessage("❌ Failed to delete. Please try again.");
    }
  }

  const totalRaised = logs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="font-[var(--font-heading)] text-xl text-white">Private Donation Activity Log</h1>
          <p className="text-xs text-muted mt-1">
            Manually log received UPI donations for committee bookkeeping. Never shown to the public.
          </p>
        </div>
        <div className="bg-gold/10 border border-gold/30 px-4 py-2 rounded-xl text-right">
          <span className="text-[0.65rem] text-gold-light tracking-wider font-bold block">TOTAL RECORDED</span>
          <span className="text-lg font-[var(--font-heading)] text-gold-light font-bold">
            ₹{totalRaised.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">Recorded Donations ({logs.length})</h2>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted border border-dashed border-[rgba(217,169,70,0.2)] rounded-lg">
              No donations logged yet. Use the form to record received amounts.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[rgba(217,169,70,0.2)] text-gold-light">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Donor Name</th>
                    <th className="pb-3 font-semibold">Amount (₹)</th>
                    <th className="pb-3 font-semibold">Note</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.06)] text-[#d4c5b0]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono text-[0.7rem] text-muted">{log.loggedAt ? new Date(log.loggedAt).toLocaleDateString("en-IN") : "Recent"}</td>
                      <td className="py-3 font-medium text-white">{log.donorName}</td>
                      <td className="py-3 font-bold text-gold-light font-mono">₹{Number(log.amount).toLocaleString("en-IN")}</td>
                      <td className="py-3 text-muted">{log.note}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDelete(log.id)} className="text-red-400 hover:text-red-300">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">➕ Log New Donation</h2>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Donor Name</label>
              <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Ramesh Kumar" className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Amount in Rupees (₹)</label>
              <input type="number" required min="1" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Note / Seva Purpose</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Maha Prasada donation" className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary !py-2.5 !px-5 text-xs font-bold w-full disabled:opacity-50">
              {loading ? "Recording..." : "Record Donation Entry →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
