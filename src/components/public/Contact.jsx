"use client";
import ScrollReveal from "./ScrollReveal";
import { fallbackSiteInfo } from "@/lib/fallbackData";

export default function Contact({ siteInfo }) {
  const data = siteInfo || fallbackSiteInfo;

  return (
    <section id="contact" className="py-20 px-[6vw] bg-[#1a0e08] text-[#f7ead5] border-t border-[rgba(217,169,70,0.15)] relative">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="section-ornament">
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-white mb-2">
              Connect With Us
            </h2>
            <span className="text-gold text-lg">✦</span>
            <p className="text-[#c8bba7] text-sm max-w-lg mx-auto mt-2">
              Have questions regarding pooja offerings, volunteering, or event schedules? Reach out to our organizing committee.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(217,169,70,0.2)] rounded-2xl p-6 text-center hover:border-gold transition-all duration-300">
              <span className="text-3xl block mb-3">📞</span>
              <h3 className="font-[var(--font-heading)] text-gold-light text-base mb-1">Phone</h3>
              <p className="text-[#e2d5c2] text-sm font-mono">{data.contactPhone || "+91 XXXXX XXXXX"}</p>
              <p className="text-[#968673] text-[0.75rem] mt-2">Available 9:00 AM – 9:00 PM</p>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(217,169,70,0.2)] rounded-2xl p-6 text-center hover:border-gold transition-all duration-300">
              <span className="text-3xl block mb-3">📧</span>
              <h3 className="font-[var(--font-heading)] text-gold-light text-base mb-1">Email</h3>
              <p className="text-[#e2d5c2] text-sm">{data.contactEmail || "sumukageleyarabalaga@gmail.com"}</p>
              <p className="text-[#968673] text-[0.75rem] mt-2">For official inquiries</p>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(217,169,70,0.2)] rounded-2xl p-6 text-center hover:border-gold transition-all duration-300">
              <span className="text-3xl block mb-3">📍</span>
              <h3 className="font-[var(--font-heading)] text-gold-light text-base mb-1">Location</h3>
              <p className="text-[#e2d5c2] text-sm">Kengeri Satellite Town</p>
              <p className="text-[#968673] text-[0.75rem] mt-2">Bengaluru, Karnataka</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
