"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { fallbackEvents, fallbackSiteInfo } from "@/lib/fallbackData";

export default function Events({ events }) {
  const data = events?.length ? events : fallbackEvents;
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="events" className="py-20 px-[7vw]">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center mb-8">
          <div className="section-ornament">
            <span>SEPTEMBER 14 — 16</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-text-body mb-2">
            Three Days of Celebration
          </h2>
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      {/* Day Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px] mx-auto mb-14">
          {data.map((day, i) => (
            <motion.article
              key={day.id || i}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative min-h-[330px] rounded-xl p-7 text-[#f7ead5] overflow-hidden cursor-pointer group"
              style={{
                backgroundImage: `url('${fallbackSiteInfo.backgroundImageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: i === 0 ? "center" : i === 1 ? "55% 60%" : "85% 65%",
              }}
              onClick={() => setActiveDay(i)}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(27,8,6,0.95)] to-[rgba(51,15,10,0.62)] group-hover:from-[rgba(27,8,6,0.9)] transition-all duration-500" />

              <div className="relative z-10">
                <span className="inline-block bg-gold text-maroon-deep rounded px-2.5 py-1.5 text-[0.67rem] font-bold">
                  DAY {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-gold-light text-[0.8rem] mt-3.5 mb-1">
                  {day.date}
                </p>
                <h3 className="font-[var(--font-heading)] text-[1.45rem] mb-4">
                  {day.title}
                </h3>
                <ul className="pl-4 leading-[1.9] text-[0.8rem] text-[#eadfce] list-disc">
                  {day.items?.slice(0, 4).map((item, j) => (
                    <li key={j}>{item.title}</li>
                  ))}
                </ul>
                <button
                  className="btn-outline mt-4 !text-[0.78rem] !py-2 !px-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDay(i);
                    document.getElementById("fullSchedule")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Full Schedule →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </ScrollReveal>

      {/* Full Schedule Section */}
      <div id="fullSchedule">
        <ScrollReveal>
          <div className="text-center mb-6">
            <div className="section-ornament">
              <span>PROGRAM TIMELINE</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-[clamp(1.5rem,2.5vw,2rem)] text-text-body mb-2">
              Event Schedule
            </h2>
            <span className="text-gold text-lg">✦</span>
          </div>
        </ScrollReveal>

        {/* Day Tabs */}
        <div className="flex justify-center gap-2.5 flex-wrap mb-8">
          {data.map((day, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`px-4 py-3 rounded-lg text-[0.85rem] font-medium border cursor-pointer transition-all duration-300 ${
                activeDay === i
                  ? "bg-maroon text-gold-light border-maroon shadow-lg"
                  : "bg-cream-light text-text-light border-[#dbc394] hover:border-gold"
              }`}
            >
              Day {String(i + 1).padStart(2, "0")} — {day.date?.replace(/\d+ /, "")} {day.date?.match(/\d+/)?.[0]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-[760px] mx-auto border-l-2 border-gold pl-6"
          >
            {data[activeDay]?.items?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pb-6 last:pb-0"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[33px] top-[5px] w-3.5 h-3.5 border-[3px] border-cream rounded-full bg-gold-muted" />

                <p className="text-gold-muted font-bold text-[0.82rem]">
                  {item.time}
                </p>
                <h4 className="font-[var(--font-heading)] text-[1.08rem] mt-1 mb-1 text-text-body">
                  {item.title}
                </h4>
                <p className="text-text-light text-[0.85rem]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-text-muted text-[0.75rem] mt-6">
          *Timings may be adjusted. Check back for final updates.
        </p>
      </div>
    </section>
  );
}
