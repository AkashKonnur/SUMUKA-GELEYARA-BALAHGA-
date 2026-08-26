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
          <span className="text-gold text-lg">✦</span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="max-w-[600px] mx-auto">
          <div className="bg-cream-light border border-[#eadfc9] rounded-2xl p-8 text-center shadow-[0_12px_40px_rgba(64,36,15,0.08)]">
            {/* Instructions */}
            <p className="text-text-light text-[0.9rem] leading-relaxed mb-6">
              {data.instructions}
            </p>

            {/* QR Code Display */}
            {data.qrImageUrl ? (
              <div className="bg-white rounded-xl p-4 inline-block mb-5 shadow-md">
                <img
                  src={data.qrImageUrl}
                  alt="Donation QR Code"
                  className="max-w-[250px] w-full h-auto object-contain"
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 inline-block mb-5 shadow-md">
                <div className="w-[200px] h-[200px] border-2 border-dashed border-[#dbc394] rounded-lg flex items-center justify-center text-text-muted text-sm">
                  <span className="text-center">
                    QR Code will appear here<br />
                    <small className="text-text-muted">(uploaded by admin)</small>
                  </span>
                </div>
              </div>
            )}

            {/* UPI Details */}
            {data.upiId && data.upiId !== "example@upi" && (
              <div className="bg-[rgba(217,169,70,0.08)] rounded-lg p-4 mt-4">
                <p className="text-sm text-text-light mb-1">UPI ID</p>
                <p className="font-mono text-text-body font-semibold text-base">
                  {data.upiId}
                </p>
                {data.upiName && (
                  <p className="text-sm text-text-muted mt-1">
                    {data.upiName}
                  </p>
                )}
              </div>
            )}

            {/* Note */}
            <p className="text-text-muted text-[0.75rem] mt-6 leading-relaxed">
              Your generous contributions help us organize a beautiful celebration
              for the entire community. Every donation, big or small, makes a
              difference. 🙏
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
