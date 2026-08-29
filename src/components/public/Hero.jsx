"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import CountdownTimer from "./CountdownTimer";
import { fallbackSiteInfo } from "@/lib/fallbackData";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

export default function Hero({ siteInfo }) {
  const data = siteInfo || fallbackSiteInfo;
  const [isKannada, setIsKannada] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[100vh] md:min-h-[770px] flex items-center overflow-hidden"
    >
      {/* Background Image — admin-controllable via siteInfo.backgroundImageUrl */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${data.backgroundImageUrl || fallbackSiteInfo.backgroundImageUrl}')`
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,7,5,0.96)] via-[rgba(10,7,5,0.78)] to-[rgba(10,7,5,0.62)]" />

      {/* Particles */}
      <ParticleCanvas />

      {/* Content */}
      <motion.div
        className="relative z-10 px-[8vw] pt-[140px] pb-[70px] max-w-[700px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Mantra */}
        <motion.p
          variants={itemVariants}
          className="text-gold-light tracking-wider text-sm mb-1 font-[var(--font-kannada)]"
        >
          ॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥
        </motion.p>

        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className="text-[0.72rem] text-gold-light tracking-[2px] font-bold uppercase mb-4"
        >
          SUMUKA GELEYARA BALAGA PRESENTS
        </motion.p>

        {/* Title */}
        <motion.h1 variants={itemVariants} className="mb-4">
          <span className="block font-[var(--font-kannada)] text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.95] text-white">
            ಗಣೇಶೋತ್ಸವ
          </span>
          <strong className="font-[var(--font-heading)] text-[clamp(2rem,4vw,3.8rem)] text-white">
            2026
          </strong>
        </motion.h1>

        {/* Subtitle — toggles between English & Kannada */}
        <motion.h2
          variants={itemVariants}
          className="font-[var(--font-heading)] text-gold-light text-lg md:text-xl mb-3 cursor-pointer group"
          onClick={() => setIsKannada(!isKannada)}
        >
          {isKannada
            ? data.heroTaglineKn || fallbackSiteInfo.heroTaglineKn
            : data.heroTaglineEn || fallbackSiteInfo.heroTaglineEn}
          <span className="ml-2 text-xs opacity-60 group-hover:opacity-100 transition-opacity">
            {isKannada ? "EN" : "ಕ"}
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="max-w-[580px] text-[#e6dccd] leading-[1.75] text-[0.95rem] mb-6"
        >
          {isKannada
            ? data.heroCopyKn || fallbackSiteInfo.heroCopyKn
            : data.heroCopyEn || fallbackSiteInfo.heroCopyEn}
        </motion.p>

        {/* Event Date Badge */}
        <motion.div
          variants={itemVariants}
          className="flex gap-3.5 items-center text-[#f7ead0] mb-6"
        >
          <span className="text-2xl">📅</span>
          <div>
            <b className="block text-sm">SEPTEMBER 14 – 16, 2026</b>
            <small className="text-muted text-xs mt-1 block">
              Three Days of Devotion. A Legacy of Eleven Years.
            </small>
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div variants={itemVariants}>
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-5 mt-7 flex-wrap"
        >
          <a href="#events" className="btn-primary">
            Explore Celebration <span>→</span>
          </a>
          <a
            href="#events"
            className="text-gold-light font-semibold no-underline hover:text-gold transition-colors"
          >
            View Schedule <span>→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Quick Rail — Desktop only */}
      <div className="absolute right-[4vw] top-[42%] z-10 hidden xl:grid gap-2.5">
        {[
          { href: "#live", icon: "🔴", label: "Live Update" },
          { href: "#donate", icon: "🙏", label: "Donate" },
          { href: "#location", icon: "🗺️", label: "Event Map" },
          { href: "#gallery", icon: "📸", label: "Gallery" },
        ].map((item, i) => (
          <motion.a
            key={item.href}
            href={item.href}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            className="text-[#f4e5c6] no-underline border border-[var(--line)] bg-[rgba(12,8,6,0.75)] backdrop-blur-sm px-4 py-3 rounded-lg flex gap-2.5 items-center text-[0.8rem] hover:bg-[rgba(217,169,70,0.1)] hover:border-gold transition-all duration-300"
          >
            {item.icon} <span>{item.label}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
