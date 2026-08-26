"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { fallbackJourney } from "@/lib/fallbackData";

export default function Journey({ journey }) {
  const data = journey?.length ? journey : fallbackJourney;

  return (
    <section
      id="journey"
      className="py-20 px-[5vw] bg-gradient-to-b from-cream to-cream-light overflow-hidden"
    >
      <ScrollReveal>
        <div className="text-center mb-12">
          <div className="section-ornament">
            <span>OUR LEGACY</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-text-body mb-2">
            11-Year Journey
          </h2>
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <div className="max-w-[1200px] mx-auto relative">
        {/* Horizontal line */}
        <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item, index) => {
            const isCurrent = item.year === 2026;
            return (
              <JourneyCard
                key={item.year}
                item={item}
                index={index}
                isCurrent={isCurrent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JourneyCard({ item, index, isCurrent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className={`relative rounded-xl overflow-hidden transition-all duration-500 group ${
        isCurrent
          ? "bg-gradient-to-br from-maroon to-maroon-deep text-white ring-2 ring-gold shadow-[0_12px_40px_rgba(217,169,70,0.25)] md:col-span-2 lg:col-span-1 xl:col-span-1"
          : "bg-cream-light border border-[#eadfc9] hover:border-gold hover:shadow-[0_8px_30px_rgba(217,169,70,0.1)]"
      }`}
    >
      {/* Year badge */}
      <div
        className={`px-5 pt-5 pb-2 flex items-center gap-3 ${
          isCurrent ? "" : ""
        }`}
      >
        <span
          className={`text-[0.65rem] font-bold tracking-wider px-3 py-1 rounded ${
            isCurrent
              ? "bg-gold text-maroon-deep"
              : "bg-[rgba(217,169,70,0.15)] text-gold-muted"
          }`}
        >
          {isCurrent ? "★ CURRENT YEAR" : `YEAR ${index + 1}`}
        </span>
      </div>

      <div className="px-5 pb-5">
        <h3
          className={`font-[var(--font-heading)] text-2xl mb-2 ${
            isCurrent ? "text-gold-light" : "text-text-body"
          }`}
        >
          {item.year}
        </h3>

        {/* Photo placeholder — replaced by admin-uploaded image */}
        {item.photo && (
          <div className="w-full h-[120px] rounded-lg mb-3 overflow-hidden bg-maroon">
            <img
              src={item.photo}
              alt={`Year ${item.year}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p
          className={`text-sm leading-relaxed ${
            isCurrent ? "text-[#e6d9c4]" : "text-text-light"
          }`}
        >
          {item.tagline}
        </p>
      </div>

      {/* Glow effect on current year */}
      {isCurrent && (
        <div className="absolute -top-1 -right-1 w-20 h-20 bg-gold rounded-full opacity-10 blur-2xl animate-pulse-gold" />
      )}
    </motion.div>
  );
}
