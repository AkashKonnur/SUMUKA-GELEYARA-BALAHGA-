"use client";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { fallbackLocation } from "@/lib/fallbackData";

export default function Location({ location }) {
  const data = location || fallbackLocation;
  const address = data.address || "158/78, Valagerahalli, Subash Nagar, Kengeri Satellite Town, Bengaluru, Karnataka 560060";
  const [isExpanded, setIsExpanded] = useState(false);

  const encodedAddress = encodeURIComponent(address);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section id="location" className="py-20 px-[5vw] md:px-[7vw] bg-[#15100b] text-[#f5e8d1] relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold opacity-5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Copy / Info */}
        <div className="lg:col-span-5">
          <ScrollReveal>
            <div className="section-ornament !justify-start">
              <span>FIND YOUR WAY</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.6rem)] text-[#fbf1dc] mb-3">
              Event Location & Venue
            </h2>
            <span className="text-gold text-lg block mb-4">✦</span>
            <p className="text-[#cfc0ab] leading-relaxed text-[0.92rem] mb-6">
              Join us at the sacred mandap. Everything a visitor needs is organized in one place for a peaceful and joyous celebration.
            </p>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(217,169,70,0.2)] rounded-xl p-5 mb-6">
              <p className="text-[0.7rem] text-gold-light tracking-widest font-bold mb-1">OFFICIAL VENUE ADDRESS</p>
              <p className="text-white font-medium text-[0.95rem] leading-relaxed">
                {address}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-7 text-[0.82rem] text-[#d6c7b2]">
              <span className="flex items-center gap-2 bg-[rgba(20,12,7,0.7)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                📍 <span>Ganesh Mandap</span>
              </span>
              <span className="flex items-center gap-2 bg-[rgba(20,12,7,0.7)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                🅿️ <span>Parking Area</span>
              </span>
              <span className="flex items-center gap-2 bg-[rgba(20,12,7,0.7)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                🍛 <span>Prasada Counter</span>
              </span>
              <span className="flex items-center gap-2 bg-[rgba(20,12,7,0.7)] p-2.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                ✚ <span>First Aid & Help</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !py-3 !px-6 text-sm"
              >
                Get Directions <span>↗</span>
              </a>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-outline !py-3 !px-5 text-sm"
              >
                {isExpanded ? "Collapse Map" : "Expand Map 🔍"}
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Styled Google Maps iframe container */}
        <div className="lg:col-span-7">
          <ScrollReveal delay={0.2}>
            <div
              className={`relative rounded-2xl overflow-hidden border-2 border-[rgba(217,169,70,0.3)] shadow-[0_15px_50px_rgba(0,0,0,0.6)] transition-all duration-500 bg-[#0d0906] ${
                isExpanded ? "h-[560px]" : "h-[380px] md:h-[420px]"
              }`}
            >
              {/* Top bar styling */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[rgba(10,7,5,0.9)] to-transparent p-4 flex items-center justify-between pointer-events-none">
                <span className="text-[0.72rem] text-gold-light font-bold tracking-wider bg-[rgba(20,12,7,0.85)] px-3 py-1 rounded-full border border-[rgba(217,169,70,0.3)]">
                  SUMUKA MANDAP PIN
                </span>
                <span className="text-[0.72rem] text-[#cfc0ab] bg-[rgba(0,0,0,0.6)] px-2.5 py-1 rounded">
                  Kengeri, Bengaluru
                </span>
              </div>

              {/* Map iframe */}
              <iframe
                title="Sumuka Geleyara Balaga Ganeshotsava Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Bottom bar overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[rgba(10,7,5,0.95)] via-[rgba(10,7,5,0.6)] to-transparent p-3.5 flex justify-between items-center text-[0.75rem] text-[#e3d5c1]">
                <span>158/78, Valagerahalli, Subash Nagar, Kengeri Satellite Town</span>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-light hover:underline font-bold"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
