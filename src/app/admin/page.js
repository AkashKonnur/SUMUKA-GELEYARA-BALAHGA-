"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fallbackEvents, fallbackAnnouncements } from "@/lib/fallbackData";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    eventsCount: fallbackEvents.reduce((acc, d) => acc + (d.items?.length || 0), 0),
    announcementsCount: fallbackAnnouncements.length,
    galleryCount: 0,
    donationsLoggedCount: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const t = Date.now();
        const fetchOpts = { cache: "no-store", headers: { "Cache-Control": "no-cache" } };
        const [evs, anns, gals, logs] = await Promise.allSettled([
          fetch(`/api/data/events?t=${t}`, fetchOpts).then((r) => r.json()),
          fetch(`/api/data/announcements?t=${t}`, fetchOpts).then((r) => r.json()),
          fetch(`/api/data/gallery?t=${t}`, fetchOpts).then((r) => r.json()),
          fetch(`/api/data/donationLog?t=${t}`, fetchOpts).then((r) => r.json()),
        ]);
        setStats({
          eventsCount: evs.status === "fulfilled" && Array.isArray(evs.value) && evs.value.length
            ? evs.value.reduce((acc, d) => acc + (d.items?.length || 0), 0)
            : stats.eventsCount,
          announcementsCount: anns.status === "fulfilled" && Array.isArray(anns.value)
            ? anns.value.length
            : stats.announcementsCount,
          galleryCount: gals.status === "fulfilled" && Array.isArray(gals.value)
            ? gals.value.length
            : 0,
          donationsLoggedCount: logs.status === "fulfilled" && Array.isArray(logs.value)
            ? logs.value.length
            : 0,
        });
      } catch {}
    }
    loadStats();
  }, []);

  const cards = [
    { title: "Program Events", count: stats.eventsCount, icon: "📅", link: "/admin/events", desc: "Day 1, 2, and 3 schedule items" },
    { title: "Live Announcements", count: stats.announcementsCount, icon: "📢", link: "/admin/announcements", desc: "Broadcast alerts and news" },
    { title: "Gallery Photos", count: stats.galleryCount, icon: "📸", link: "/admin/gallery", desc: "Images visible in the gallery grid" },
    { title: "Logged Donations", count: stats.donationsLoggedCount, icon: "📝", link: "/admin/donations-log", desc: "Private admin log entries" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl text-white">Welcome to CMS Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Manage your Ganeshotsava 2026 website content easily without writing code.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline !py-2 !px-4 text-xs">
          View Public Site ↗
        </a>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.link}
            className="bg-[#180f0a] border border-[rgba(217,169,70,0.18)] hover:border-gold rounded-xl p-5 block transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-2xl font-[var(--font-heading)] text-gold-light group-hover:scale-110 transition-transform">
                {c.count}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-white group-hover:text-gold-light transition-colors">{c.title}</h2>
            <p className="text-[0.75rem] text-muted mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Action Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#180f0a] border border-[rgba(217,169,70,0.15)] rounded-xl p-6">
          <h2 className="font-[var(--font-heading)] text-base text-gold-light mb-2">📢 Post Live Update</h2>
          <p className="text-xs text-[#cfc0ab] leading-relaxed mb-4">
            Have a new announcement regarding pooja timings or prasada? Broadcast it instantly to all devotees on the home page.
          </p>
          <Link href="/admin/announcements" className="btn-primary !py-2 !px-4 !text-xs">
            Create Announcement →
          </Link>
        </div>

        <div className="bg-[#180f0a] border border-[rgba(217,169,70,0.15)] rounded-xl p-6">
          <h2 className="font-[var(--font-heading)] text-base text-gold-light mb-2">💳 Manage Donation QR</h2>
          <p className="text-xs text-[#cfc0ab] leading-relaxed mb-4">
            Upload or replace your committee&apos;s PhonePe/GPay/UPI QR code image and customize UPI instructions.
          </p>
          <Link href="/admin/donation" className="btn-primary !py-2 !px-4 !text-xs">
            Update QR Code →
          </Link>
        </div>
      </div>
    </div>
  );
}
