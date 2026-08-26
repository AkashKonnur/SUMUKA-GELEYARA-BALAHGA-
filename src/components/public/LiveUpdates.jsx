"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { fallbackAnnouncements } from "@/lib/fallbackData";

export default function LiveUpdates({ announcements: initialAnnouncements }) {
  const [announcements, setAnnouncements] = useState(
    initialAnnouncements?.length ? initialAnnouncements : fallbackAnnouncements
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Firestore real-time listener — will work when Firebase is connected
  useEffect(() => {
    let unsubscribe;
    async function setupListener() {
      try {
        const { subscribeToCollection } = await import("@/lib/firestore");
        unsubscribe = subscribeToCollection("announcements", (data) => {
          if (data.length > 0) {
            setAnnouncements(data);
            setCurrentIndex(0);
          }
        });
      } catch {
        // Firebase not configured — use fallback data
      }
    }
    setupListener();
    return () => unsubscribe?.();
  }, []);

  const next = () => setCurrentIndex((i) => (i + 1) % announcements.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + announcements.length) % announcements.length);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <section
      id="live"
      className="bg-gradient-to-br from-[#190906] via-[#40140e] to-[#160a08] text-[#f7ead9] py-16 px-[7vw]"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
            <div>
              <p className="text-[0.72rem] text-gold-light tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_14px_#f44336] animate-pulse" />
                LIVE EVENT CENTER
              </p>
              <h2 className="font-[var(--font-heading)] text-[clamp(1.5rem,3vw,2rem)] mt-1.5">
                Ganeshotsava Updates
              </h2>
              <p className="text-[#c7b9a5] text-sm mt-1">
                Live announcements and updates from the organizers.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Panels */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden">
            {/* Status */}
            <div className="p-7 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.1)]">
              <span className="text-[0.68rem] text-gold-light tracking-widest">
                CURRENT STATUS
              </span>
              <h3 className="font-[var(--font-heading)] mt-3.5 mb-1.5 text-lg">
                Celebration begins soon
              </h3>
              <p className="text-[#d8c7b1] text-[0.8rem]">September 14, 2026</p>
              <a
                href="#events"
                className="btn-outline mt-4 !text-[0.75rem] !py-2 !px-3 inline-flex"
              >
                View Schedule
              </a>
            </div>

            {/* Next Event */}
            <div className="p-7 border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.1)]">
              <span className="text-[0.68rem] text-gold-light tracking-widest">
                NEXT EVENT
              </span>
              <h3 className="font-[var(--font-heading)] mt-3.5 mb-1.5 text-lg">
                Ganesh Pratishthapane
              </h3>
              <p className="text-[#d8c7b1] text-[0.8rem]">
                Check the official schedule
              </p>
            </div>

            {/* Announcements Carousel */}
            <div className="p-7 min-h-[180px] flex flex-col">
              <span className="text-[0.68rem] text-gold-light tracking-widest">
                📢 ANNOUNCEMENTS
              </span>
              <div className="flex-1 flex items-center mt-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-[0.9rem] leading-relaxed"
                  >
                    {announcements[currentIndex]?.text}
                    {announcements[currentIndex]?.imageUrl && (
                      <img
                        src={announcements[currentIndex].imageUrl}
                        alt="Update"
                        className="mt-3 rounded-lg max-h-[120px] object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={prev}
                  className="bg-[#6c2418] text-gold-light border-0 px-3 py-2 rounded cursor-pointer hover:bg-[#8a2e1e] transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  className="bg-[#6c2418] text-gold-light border-0 px-3 py-2 rounded cursor-pointer hover:bg-[#8a2e1e] transition-colors"
                >
                  →
                </button>
                <span className="text-text-muted text-[0.7rem] ml-auto self-center">
                  {currentIndex + 1} / {announcements.length}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
