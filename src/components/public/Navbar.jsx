"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Events", href: "#events" },
  { label: "Live", href: "#live" },
  { label: "Gallery", href: "#gallery" },
  { label: "Donate", href: "#donate" },
  { label: "Location", href: "#location" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgressWidth(h > 0 ? (window.scrollY / h) * 100 : 0);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div
        className="scroll-progress"
        style={{ width: `${progressWidth}%` }}
      />

      <header
        className={`fixed top-0 w-full z-[999] transition-all duration-500 ${
          scrolled
            ? "bg-[rgba(12,8,6,0.92)] backdrop-blur-xl shadow-lg border-b border-[rgba(217,169,70,0.12)]"
            : "bg-[rgba(12,8,6,0.6)] backdrop-blur-md"
        }`}
        style={{ height: 76 }}
      >
        <div className="max-w-[1400px] mx-auto h-full px-6 flex items-center justify-between gap-5">
          {/* Brand */}
          <a
            href="#home"
            className="flex items-center gap-3 no-underline text-gold-light min-w-[200px] group"
          >
            <span className="text-3xl text-gold transition-transform duration-500 group-hover:rotate-12">
              ॐ
            </span>
            <span>
              <b className="font-[var(--font-kannada)] text-[0.95rem] block">
                ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ
              </b>
              <small className="text-[0.68rem] text-muted block mt-0.5">
                11th Year • Ganeshotsava 2026
              </small>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[#d9cfbd] hover:text-gold-light text-[0.83rem] no-underline transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-5" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#events"
              className="btn-primary hidden sm:inline-flex !py-2.5 !px-5 !text-[0.8rem]"
            >
              Explore
            </a>
            <button
              className="lg:hidden text-gold-light text-2xl bg-transparent border-0 cursor-pointer p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[76px] left-0 right-0 z-[998] bg-[rgba(15,9,6,0.97)] backdrop-blur-xl border-b border-[rgba(217,169,70,0.15)] lg:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#d9cfbd] hover:text-gold-light text-[0.9rem] no-underline py-3 px-3 rounded-lg hover:bg-[rgba(217,169,70,0.08)] transition-all duration-300"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
