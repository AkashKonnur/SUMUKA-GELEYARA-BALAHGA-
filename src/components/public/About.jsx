"use client";
import ScrollReveal from "./ScrollReveal";
import { fallbackSiteInfo } from "@/lib/fallbackData";

export default function About({ siteInfo }) {
  const data = siteInfo || fallbackSiteInfo;

  return (
    <section id="about" className="py-20 px-[7vw]">
      <ScrollReveal>
        <div className="max-w-[900px] mx-auto text-center">
          <div className="section-ornament">
            <span>WHO WE ARE</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-text-body mb-2">
            About Sumuka Geleyara Balaga
          </h2>
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="max-w-[800px] mx-auto mt-8">
          <p className="text-text-light leading-[1.85] text-[0.95rem] text-center">
            {data.about}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: "🙏",
                title: "Devotion",
                desc: "Rooted in deep spiritual traditions and love for Lord Ganesha.",
              },
              {
                icon: "🤝",
                title: "Community",
                desc: "Bringing together families, friends, and neighbors as one.",
              },
              {
                icon: "🎭",
                title: "Culture",
                desc: "Celebrating our heritage through music, dance, and art.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-cream-light rounded-xl p-6 text-center border border-[#eadfc9] hover:border-gold hover:shadow-[0_8px_30px_rgba(217,169,70,0.1)] transition-all duration-500 group"
              >
                <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <h3 className="font-[var(--font-heading)] text-lg text-text-body mb-2">
                  {item.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
