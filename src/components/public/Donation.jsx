"use client";
import ScrollReveal from "./ScrollReveal";
import { fallbackDonation } from "@/lib/fallbackData";

export default function Donation({ donation }) {
  const data = donation || fallbackDonation;

  return (
    <section
      id="donate"
      className="py-20 px-[7vw] bg-gradient-to-b from-cream-light to-cream"
    >
      <ScrollReveal>
        <div className="text-center mb-8">
          <div className="section-ornament">
            <span>SUPPORT THE CELEBRATION</span>
          </div>
          <h2 className="font-[var(--font-heading)] text-[clamp(1.7rem,3vw,2.5rem)] text-text-body mb-2">
            Contribute to Ganeshotsava
          </h2>
          <p className="text-text-light text-sm max-w-xl mx-auto leading-relaxed">
            {data.instructions}
          </p>
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="max-w-[480px] mx-auto">
          <div className="bg-cream-light border border-[#eadfc9] rounded-2xl shadow-[0_12px_40px_rgba(64,36,15,0.08)] overflow-hidden">

            {/* QR Code Display */}
            <div className="p-8 text-center">
              <p className="text-text-light text-sm leading-relaxed mb-6">
                Scan the QR code below using PhonePe, GPay, Paytm, or any UPI app to contribute.
              </p>

              {data.qrImageUrl ? (
                <div className="bg-white rounded-xl p-4 inline-block mb-5 shadow-md">
                  <img
                    src={data.qrImageUrl}
                    alt="Donation QR Code — Scan with any UPI app"
                    className="max-w-[240px] w-full h-auto object-contain"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 inline-block mb-5 shadow-md">
                  <div className="w-[220px] h-[220px] border-2 border-dashed border-[#dbc394] rounded-lg flex items-center justify-center text-text-muted text-sm">
                    <span className="text-center">
                      QR Code will appear here<br />
                      <small className="text-text-muted">(uploaded by admin)</small>
                    </span>
                  </div>
                </div>
              )}

              <p className="text-text-muted text-[0.78rem] leading-relaxed">
                Open your UPI app → Scan QR → Enter amount → Pay
              </p>
            </div>

            {/* Footer note */}
            <div className="px-7 pb-6 pt-0 text-center border-t border-[#eadfc9]">
              <p className="text-text-muted text-[0.72rem] leading-relaxed mt-4">
                Your generous contributions help us organise a beautiful celebration for the entire community.
                Every donation, big or small, makes a difference. 🙏
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
