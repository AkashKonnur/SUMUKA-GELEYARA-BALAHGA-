"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

export default function Gallery({ gallery }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // If Firebase gallery data exists, use it; otherwise show styled placeholders
  const images = gallery?.length
    ? gallery
    : Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        imageUrl: "/assets/ganeshotsava-design.png",
        caption: `Ganeshotsava Moment ${i + 1}`,
      }));

  const positions = [
    "5% 10%",
    "32% 15%",
    "53% 40%",
    "76% 50%",
    "95% 15%",
    "20% 60%",
  ];

  return (
    <section id="gallery" className="py-20 px-[7vw]">
      <ScrollReveal>
        <div className="text-center mb-8">
          <div className="section-ornament">
            <span>GLIMPSES OF DEVOTION</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-text-body mb-2">
            Memories That Stay Forever
          </h2>
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-[1250px] mx-auto">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxIndex(i)}
              className={`relative rounded-xl overflow-hidden border-0 cursor-pointer group ${
                i === 0 ? "md:col-span-2 md:row-span-2 h-[300px] md:h-auto" : "h-[200px]"
              }`}
              aria-label={`Open ${img.caption || "image"}`}
            >
              {img.imageUrl?.startsWith("/assets") ? (
                <div
                  className="w-full h-full bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${img.imageUrl})`,
                    backgroundPosition: positions[i % positions.length],
                    backgroundSize: "600% auto",
                  }}
                />
              ) : (
                <img
                  src={img.imageUrl}
                  alt={img.caption || "Gallery"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-medium">
                  {img.caption || "View"}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxIndex(-1)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex]?.imageUrl}
                alt={images[lightboxIndex]?.caption || "Gallery image"}
                className="max-w-full max-h-[85vh] rounded-xl object-contain"
              />

              {/* Close */}
              <button
                onClick={() => setLightboxIndex(-1)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-maroon text-gold-light border-0 text-xl cursor-pointer hover:bg-[#5a1a12] transition-colors flex items-center justify-center"
              >
                ✕
              </button>

              {/* Nav */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-3 w-10 h-10 rounded-full bg-[rgba(0,0,0,0.6)] text-white border-0 text-lg cursor-pointer hover:bg-[rgba(0,0,0,0.8)] transition-colors flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-3 w-10 h-10 rounded-full bg-[rgba(0,0,0,0.6)] text-white border-0 text-lg cursor-pointer hover:bg-[rgba(0,0,0,0.8)] transition-colors flex items-center justify-center"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Caption */}
              {images[lightboxIndex]?.caption && (
                <p className="text-center text-white text-sm mt-3 opacity-80">
                  {images[lightboxIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
