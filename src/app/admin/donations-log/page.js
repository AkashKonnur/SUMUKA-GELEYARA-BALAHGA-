"use client";
import { useState, useEffect, useMemo } from "react";

// ─── Date helpers ──────────────────────────────────────────────────────────────
function toLocalDateStr(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function toLocalTimeStr(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function startOfDay(d) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function endOfDay(d) {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    initiated:  "bg-yellow-900/30 text-yellow-300 border-yellow-700/40",
    confirmed:  "bg-green-900/30 text-green-300 border-green-700/40",
    cancelled:  "bg-red-900/30 text-red-300 border-red-700/40",
  };
  const labels = { initiated: "Pending", confirmed: "Confirmed", cancelled: "Cancelled" };
  return (
    <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded border ${styles[status] || styles.initiated}`}>
      {labels[status] || status}
    </span>
  );
}

// ─── PDF generation (client-side, no paid library needed) ────────────────────
function generatePDF(records, dateLabel, orgName = "Sumuka Geleyara Balaga") {
  const total = records.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const confirmed = records.filter(r => r.status === "confirmed");
  const confirmedTotal = confirmed.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const now = new Date().toLocaleString("en-IN");

  const rows = records.map((r, i) => `
    <tr style="border-bottom:1px solid #e8e0d0; ${i % 2 === 1 ? "background:#fdf8ee;" : ""}">
      <td style="padding:8px 10px; font-family:monospace; font-size:11px; color:#666;">${r.id?.slice(-8) || "—"}</td>
      <td style="padding:8px 10px; font-size:12px;">${toLocalDateStr(r.loggedAt || r.createdAt)}</td>
      <td style="padding:8px 10px; font-size:11px; color:#888;">${toLocalTimeStr(r.loggedAt || r.createdAt)}</td>
      <td style="padding:8px 10px; font-size:12px; font-weight:600;">${r.donorName || "Anonymous"}</td>
      <td style="padding:8px 10px; font-size:13px; font-weight:700; color:#43150f; text-align:right;">₹${Number(r.amount || 0).toLocaleString("en-IN")}</td>
      <td style="padding:8px 10px; text-align:center;">${r.status === "confirmed" ? "✅" : r.status === "cancelled" ? "❌" : "⏳"}</td>
      <td style="padding:8px 10px; font-size:11px; color:#888;">${r.note || "—"}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Donation Report — ${dateLabel}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@400;600;700&display=swap');
    body { font-family: 'Inter', Arial, sans-serif; color: #2c1b12; margin: 0; padding: 32px; background: white; }
    h1 { font-family: 'Cinzel', serif; color: #43150f; font-size: 22px; margin: 0 0 4px; }
    .subtitle { color: #888; font-size: 13px; margin: 0 0 24px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; padding-bottom:16px; border-bottom:2px solid #d9a946; }
    .logo-area h2 { font-family:'Cinzel',serif; font-size:15px; color:#d9a946; margin:0 0 2px; }
    .summary-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
    .card { background:#fdf8ee; border:1px solid #eadfc9; border-radius:10px; padding:14px 16px; }
    .card-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#8a7358; }
    .card-val { font-size:22px; font-weight:700; color:#2c1b12; margin-top:4px; }
    .card-val.green { color:#166534; }
    table { width:100%; border-collapse:collapse; margin-top:8px; }
    thead tr { background:#43150f; color:white; }
    th { padding:10px; font-size:11px; font-weight:600; text-align:left; text-transform:uppercase; letter-spacing:.04em; }
    th:last-child { text-align:right; }
    .total-row td { background:#fdf3dc; font-weight:700; font-size:13px; padding:10px; border-top:2px solid #d9a946; }
    .footer { margin-top:32px; padding-top:12px; border-top:1px solid #eadfc9; font-size:10px; color:#aaa; display:flex; justify-content:space-between; }
    @media print { body { padding:16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h2>🕉 ${orgName}</h2>
      <h1>Donation Collection Report</h1>
      <p class="subtitle">Period: ${dateLabel}</p>
    </div>
    <div style="text-align:right; font-size:11px; color:#888;">
      <p style="margin:0;">Generated on</p>
      <p style="margin:4px 0 0; font-weight:600; color:#555;">${now}</p>
    </div>
  </div>

  <div class="summary-cards">
    <div class="card">
      <div class="card-label">Total Transactions</div>
      <div class="card-val">${records.length}</div>
    </div>
    <div class="card">
      <div class="card-label">Confirmed Transactions</div>
      <div class="card-val green">${confirmed.length}</div>
    </div>
    <div class="card">
      <div class="card-label">Total Confirmed Amount</div>
      <div class="card-val green">₹${confirmedTotal.toLocaleString("en-IN")}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Ref ID</th>
        <th>Date</th>
        <th>Time</th>
        <th>Donor</th>
        <th style="text-align:right;">Amount</th>
        <th style="text-align:center;">Status</th>
        <th>Note</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="7" style="text-align:center;padding:24px;color:#aaa;">No records for this period.</td></tr>'}
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="4">Total (all transactions)</td>
        <td style="text-align:right;">₹${total.toLocaleString("en-IN")}</td>
        <td colspan="2">${records.length} record(s)</td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <span>Sumuka Geleyara Balaga — Ganeshotsava 2026</span>
    <span>Confidential — Admin use only</span>
  </div>

  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) alert("Please allow popups to generate the PDF report.");
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDonationsLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Filter state
  const [filterMode, setFilterMode] = useState("all"); // "all"|"today"|"yesterday"|"week"|"month"|"custom"
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all"|"initiated"|"confirmed"|"cancelled"

  // Manual add form
  const [addForm, setAddForm] = useState({ donorName: "", amount: "", note: "", status: "confirmed" });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await fetch(`/api/data/donationLog?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setLogs(data);
      }
    } catch { }
    setLoading(false);
  }

  // ── Filtered records ──────────────────────────────────────────────────────
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Date filter
    const now = new Date();
    if (filterMode === "today") {
      const s = startOfDay(now), e = endOfDay(now);
      result = result.filter(l => { const d = new Date(l.loggedAt || l.createdAt); return d >= s && d <= e; });
    } else if (filterMode === "yesterday") {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      const s = startOfDay(y), e = endOfDay(y);
      result = result.filter(l => { const d = new Date(l.loggedAt || l.createdAt); return d >= s && d <= e; });
    } else if (filterMode === "week") {
      const s = new Date(now); s.setDate(s.getDate() - 7); s.setHours(0, 0, 0, 0);
      result = result.filter(l => new Date(l.loggedAt || l.createdAt) >= s);
    } else if (filterMode === "month") {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter(l => new Date(l.loggedAt || l.createdAt) >= s);
    } else if (filterMode === "custom" && customFrom && customTo) {
      const s = startOfDay(new Date(customFrom)), e = endOfDay(new Date(customTo));
      result = result.filter(l => { const d = new Date(l.loggedAt || l.createdAt); return d >= s && d <= e; });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(l => l.status === statusFilter);
    }

    return result;
  }, [logs, filterMode, customFrom, customTo, statusFilter]);

  const totalAmount = filteredLogs.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const confirmedLogs = filteredLogs.filter(l => l.status === "confirmed");
  const confirmedAmount = confirmedLogs.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  // ── Confirm / Cancel / Delete ────────────────────────────────────────────
  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/admin/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setLogs(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        setMessage(`✅ Record marked as ${status}.`);
      }
    } catch { setMessage("❌ Failed to update."); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this donation record permanently?")) return;
    try {
      await fetch(`/api/data/donationLog?id=${id}`, { method: "DELETE" });
      setLogs(prev => prev.filter(l => l.id !== id));
      setMessage("✅ Record deleted.");
    } catch { setMessage("❌ Failed to delete."); }
  }

  // ── Add manual entry ─────────────────────────────────────────────────────
  async function handleAdd(e) {
    e.preventDefault();
    if (!addForm.amount) return;
    setAddLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/data/donationLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: addForm.donorName.trim() || "Anonymous Devotee",
          amount: parseFloat(addForm.amount),
          note: addForm.note.trim() || "Manual entry by admin",
          status: addForm.status,
          loggedAt: new Date().toISOString(),
        }),
      });
      const newLog = await res.json();
      if (res.ok) {
        setLogs(prev => [newLog, ...prev]);
        setAddForm({ donorName: "", amount: "", note: "", status: "confirmed" });
        setMessage("✅ Donation entry recorded!");
      }
    } catch { setMessage("❌ Failed to record."); }
    setAddLoading(false);
  }

  // ── PDF export ───────────────────────────────────────────────────────────
  function handleExportPDF() {
    const labels = {
      all: "All Time",
      today: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
      yesterday: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }); })(),
      week: "Last 7 Days",
      month: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      custom: customFrom && customTo ? `${customFrom} to ${customTo}` : "Custom Range",
    };
    generatePDF(filteredLogs, labels[filterMode]);
  }

  const filterBtns = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "Last 7 Days" },
    { key: "month", label: "This Month" },
    { key: "custom", label: "Custom" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-xl text-white">Donation Dashboard</h1>
          <p className="text-xs text-muted mt-1">
            View, confirm, and export donation records. UPI payments appear here automatically when donors pay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="btn-primary !py-2 !px-4 text-xs font-bold"
          >
            📄 Export PDF Report
          </button>
          <button onClick={loadLogs} className="btn-outline !py-2 !px-3 text-xs">↺ Refresh</button>
        </div>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Transactions", val: filteredLogs.length, icon: "📊", color: "text-white" },
          { label: "Confirmed", val: confirmedLogs.length, icon: "✅", color: "text-green-400" },
          { label: "Total Amount", val: `₹${totalAmount.toLocaleString("en-IN")}`, icon: "💰", color: "text-gold-light" },
          { label: "Confirmed Amount", val: `₹${confirmedAmount.toLocaleString("en-IN")}`, icon: "🏅", color: "text-green-400" },
        ].map(c => (
          <div key={c.label} className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xl">{c.icon}</span>
            </div>
            <p className={`text-xl font-[var(--font-heading)] font-bold ${c.color}`}>{c.val}</p>
            <p className="text-[0.7rem] text-muted mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Table */}
        <div className="lg:col-span-8 space-y-5">
          {/* Filter bar */}
          <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {filterBtns.map(b => (
                <button
                  key={b.key}
                  onClick={() => setFilterMode(b.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    filterMode === b.key
                      ? "bg-gold text-maroon-deep border-gold"
                      : "bg-transparent text-muted border-[rgba(217,169,70,0.2)] hover:border-gold"
                  }`}
                >
                  {b.label}
                </button>
              ))}
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="ml-auto bg-[#0c0704] border border-[rgba(217,169,70,0.25)] text-xs text-[#cfc0ab] rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold"
              >
                <option value="all">All Status</option>
                <option value="initiated">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Custom date range */}
            {filterMode === "custom" && (
              <div className="flex gap-3 items-center pt-1">
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                  className="bg-[#0c0704] border border-[rgba(217,169,70,0.25)] text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold" />
                <span className="text-muted text-xs">to</span>
                <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                  className="bg-[#0c0704] border border-[rgba(217,169,70,0.25)] text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold" />
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gold-light mb-4">
              Transactions ({filteredLogs.length})
            </h2>

            {loading ? (
              <div className="py-12 text-center text-xs text-muted animate-pulse">Loading records...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted border border-dashed border-[rgba(217,169,70,0.2)] rounded-lg">
                No transactions found for the selected period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[rgba(217,169,70,0.2)] text-gold-light text-[0.7rem] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date / Time</th>
                      <th className="pb-3 font-semibold">Donor</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 font-semibold text-center">Status</th>
                      <th className="pb-3 font-semibold">Note</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-[#d4c5b0]">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-3">
                          <p className="font-mono text-[0.7rem] text-muted">{toLocalDateStr(log.loggedAt || log.createdAt)}</p>
                          <p className="font-mono text-[0.65rem] text-muted/70">{toLocalTimeStr(log.loggedAt || log.createdAt)}</p>
                        </td>
                        <td className="py-3 font-medium text-white">{log.donorName || "Anonymous"}</td>
                        <td className="py-3 font-bold text-gold-light font-mono text-right">
                          ₹{Number(log.amount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-center"><StatusBadge status={log.status} /></td>
                        <td className="py-3 text-muted text-[0.72rem] max-w-[120px] truncate">{log.note || "—"}</td>
                        <td className="py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {log.status !== "confirmed" && (
                              <button
                                onClick={() => updateStatus(log.id, "confirmed")}
                                className="text-[0.65rem] text-green-400 bg-green-900/20 hover:bg-green-900/40 px-2 py-1 rounded"
                              >
                                Confirm
                              </button>
                            )}
                            {log.status !== "cancelled" && (
                              <button
                                onClick={() => updateStatus(log.id, "cancelled")}
                                className="text-[0.65rem] text-red-400 bg-red-900/20 hover:bg-red-900/40 px-2 py-1 rounded"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(log.id)}
                              className="text-[0.65rem] text-muted hover:text-red-400 px-2 py-1 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {filteredLogs.length > 0 && (
                    <tfoot>
                      <tr className="border-t-2 border-[rgba(217,169,70,0.3)]">
                        <td className="pt-3 text-gold-light font-bold text-xs" colSpan={2}>Total</td>
                        <td className="pt-3 text-gold-light font-bold font-mono text-right">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td colSpan={3} />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Manual Entry */}
        <div className="lg:col-span-4">
          <div className="bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5 sticky top-4">
            <h2 className="text-sm font-semibold text-gold-light mb-4">➕ Add Manual Entry</h2>
            <p className="text-[0.72rem] text-muted mb-4 leading-relaxed">
              Record cash donations or UPI payments received offline. These are private admin records only.
            </p>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Donor Name</label>
                <input
                  type="text"
                  value={addForm.donorName}
                  onChange={e => setAddForm({ ...addForm, donorName: e.target.value })}
                  placeholder="Ramesh Kumar"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={addForm.amount}
                  onChange={e => setAddForm({ ...addForm, amount: e.target.value })}
                  placeholder="1000"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Note / Seva Purpose</label>
                <input
                  type="text"
                  value={addForm.note}
                  onChange={e => setAddForm({ ...addForm, note: e.target.value })}
                  placeholder="Maha Prasada donation"
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">Status</label>
                <select
                  value={addForm.status}
                  onChange={e => setAddForm({ ...addForm, status: e.target.value })}
                  className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                >
                  <option value="confirmed">Confirmed (received)</option>
                  <option value="initiated">Pending (not yet confirmed)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="btn-primary !py-2.5 !px-5 text-xs font-bold w-full disabled:opacity-50"
              >
                {addLoading ? "Recording..." : "Record Donation Entry →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
