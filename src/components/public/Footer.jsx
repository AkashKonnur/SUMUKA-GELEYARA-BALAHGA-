"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#2b0e09] to-[#4c170f] text-[#e9d7b8] pt-14 pb-8 px-[6vw] border-t border-[rgba(217,169,70,0.2)]">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[rgba(255,255,255,0.1)]">
        {/* Brand */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl text-gold">ॐ</span>
            <div>
              <h3 className="font-[var(--font-kannada)] text-xl text-gold-light font-bold">
                ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ
              </h3>
              <p className="text-xs text-muted">11th Year • Ganeshotsava 2026</p>
            </div>
          </div>
          <p className="text-sm text-[#d4c3a9] leading-relaxed max-w-sm mt-3">
            11 Years of Faith, Devotion & Unity. Celebrating our rich cultural heritage with the entire community.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h4 className="font-[var(--font-heading)] text-gold-light text-sm tracking-wider uppercase mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-[0.82rem] text-[#d4c3a9]">
            <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-gold transition-colors">About Us</a></li>
            <li><a href="#journey" className="hover:text-gold transition-colors">11-Year Journey</a></li>
            <li><a href="#events" className="hover:text-gold transition-colors">Event Schedule</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="lg:col-span-2">
          <h4 className="font-[var(--font-heading)] text-gold-light text-sm tracking-wider uppercase mb-4">
            Celebration
          </h4>
          <ul className="space-y-2 text-[0.82rem] text-[#d4c3a9]">
            <li><a href="#live" className="hover:text-gold transition-colors">Live Updates</a></li>
            <li><a href="#gallery" className="hover:text-gold transition-colors">Photo Gallery</a></li>
            <li><a href="#donate" className="hover:text-gold transition-colors">Donations & Seva</a></li>
            <li><a href="#location" className="hover:text-gold transition-colors">Event Venue</a></li>
          </ul>
        </div>

        {/* Blessing */}
        <div className="lg:col-span-4 bg-[rgba(0,0,0,0.25)] p-5 rounded-xl border border-[rgba(217,169,70,0.15)] flex flex-col justify-center">
          <p className="font-[var(--font-heading)] text-sm italic text-[#f7eedc] leading-relaxed">
            “May Lord Ganesha bestow wisdom, health, happiness, and prosperity upon your family.”
          </p>
          <p className="text-gold font-bold font-[var(--font-heading)] text-base mt-3 tracking-wide">
            ॥ गणपति बाप्पा मोरया ॥
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1250px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#bfae93]">
        <p>© 2026 Sumuka Geleyara Balaga • 11th Year Ganeshotsava Celebration</p>
        <p className="flex items-center gap-1">
          Made with <span className="text-red-400">❤</span> for Devotion & Tradition
        </p>
      </div>
    </footer>
  );
}
