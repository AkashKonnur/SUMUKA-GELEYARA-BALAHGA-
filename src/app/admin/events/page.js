"use client";
import { useState, useEffect } from "react";
import { getEvents, setSingleDoc } from "@/lib/firestore";
import { fallbackEvents } from "@/lib/fallbackData";

export default function AdminEventsPage() {
  const [events, setEvents] = useState(fallbackEvents);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Form for adding/editing an item
  const [newItem, setNewItem] = useState({ time: "", title: "", description: "" });
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEvents();
        if (data && data.length) setEvents(data);
      } catch {}
    }
    load();
  }, []);

  const currentDay = events[activeDayIndex] || events[0];

  function handleSaveItem(e) {
    e.preventDefault();
    if (!newItem.time || !newItem.title) return;

    const updatedEvents = [...events];
    const dayItems = [...(updatedEvents[activeDayIndex].items || [])];

    if (editIndex >= 0) {
      dayItems[editIndex] = newItem;
    } else {
      dayItems.push(newItem);
    }

    updatedEvents[activeDayIndex] = {
      ...updatedEvents[activeDayIndex],
      items: dayItems,
    };

    setEvents(updatedEvents);
    setNewItem({ time: "", title: "", description: "" });
    setEditIndex(-1);
  }

  function handleDeleteItem(idx) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const updatedEvents = [...events];
    const dayItems = [...updatedEvents[activeDayIndex].items];
    dayItems.splice(idx, 1);
    updatedEvents[activeDayIndex] = {
      ...updatedEvents[activeDayIndex],
      items: dayItems,
    };
    setEvents(updatedEvents);
  }

  async function handlePersistAll() {
    setSaving(true);
    setMessage("");
    try {
      // Save each day doc
      for (let i = 0; i < events.length; i++) {
        await setSingleDoc("events", events[i], `day${i + 1}`);
      }
      setMessage("✅ Schedule changes saved successfully!");
    } catch (err) {
      setMessage("⚠️ Failed to save to database. Check Firebase connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-[var(--font-heading)] text-xl text-white">
            Program Schedule Manager
          </h1>
          <p className="text-xs text-muted mt-1">
            Add, update, or remove activities for Day 1, Day 2, and Day 3.
          </p>
        </div>
        <button
          onClick={handlePersistAll}
          disabled={saving}
          className="btn-primary !py-2.5 !px-5 text-xs font-bold disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save Changes to Live Site"}
        </button>
      </div>

      {message && (
        <div className="p-3 mb-5 bg-[rgba(217,169,70,0.1)] border border-gold/40 rounded-lg text-xs text-gold-light">
          {message}
        </div>
      )}

      {/* Day Tabs */}
      <div className="flex gap-2 mb-6">
        {events.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveDayIndex(i);
              setEditIndex(-1);
              setNewItem({ time: "", title: "", description: "" });
            }}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
              activeDayIndex === i
                ? "bg-gold text-maroon-deep border-gold font-bold"
                : "bg-[#180f0a] text-[#c7b9a5] border-[rgba(217,169,70,0.2)] hover:border-gold"
            }`}
          >
            Day {i + 1} ({d.date})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Existing Items Table */}
        <div className="lg:col-span-7 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4 flex justify-between">
            <span>Current Day {activeDayIndex + 1} Activities</span>
            <span className="text-xs text-muted">
              {currentDay.items?.length || 0} items
            </span>
          </h2>

          <div className="space-y-3">
            {currentDay.items?.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0f0a07] border border-[rgba(255,255,255,0.06)] rounded-lg p-3.5 flex justify-between items-start hover:border-gold/30 transition-all"
              >
                <div>
                  <span className="text-[0.7rem] font-mono text-gold-muted font-bold block">
                    {item.time}
                  </span>
                  <h4 className="text-sm text-white font-medium mt-0.5">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditIndex(idx);
                      setNewItem(item);
                    }}
                    className="text-xs text-gold-light bg-gold/10 hover:bg-gold/20 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    className="text-xs text-red-400 bg-red-950/40 hover:bg-red-900/60 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form: Add / Edit Item */}
        <div className="lg:col-span-5 bg-[#160d08] border border-[rgba(217,169,70,0.18)] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gold-light mb-4">
            {editIndex >= 0 ? "✏️ Edit Activity" : "➕ Add New Activity"}
          </h2>

          <form onSubmit={handleSaveItem} className="space-y-4">
            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Time (e.g. "08:00 AM" or "06:30 PM")
              </label>
              <input
                type="text"
                required
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                placeholder="10:30 AM"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Activity Title
              </label>
              <input
                type="text"
                required
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Maha Mangalaarathi"
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-[#cfc0ab] mb-1 font-medium">
                Short Description (Optional)
              </label>
              <textarea
                rows={3}
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                placeholder="Devotees will gather for the grand aarti..."
                className="w-full bg-[#0c0704] border border-[rgba(217,169,70,0.25)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="btn-primary !py-2 !px-4 text-xs font-bold"
              >
                {editIndex >= 0 ? "Update Activity" : "Add to Day"}
              </button>
              {editIndex >= 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setEditIndex(-1);
                    setNewItem({ time: "", title: "", description: "" });
                  }}
                  className="btn-outline !py-2 !px-3 text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
