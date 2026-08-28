"use client";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { fallbackDonation } from "@/lib/fallbackData";

const QUICK_AMOUNTS = [51, 101, 251, 501, 1001, 2501];

export default function Donation({ donation }) {
  const data = donation || fallbackDonation;
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [activeTab, setActiveTab] = useState("upi"); // "upi" | "qr"
  const [step, setStep] = useState("enter"); // "enter" | "paying" | "done"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 1;
  const upiId = data.upiId && data.upiId !== "example@upi" ? data.upiId : null;

  // Builds the UPI deep link (works on Android/iOS with PhonePe, GPay, Paytm etc.)
  function buildUpiLink() {
    const params = new URLSearchParams({
      pa: upiId || "",
      pn: data.upiName || "Sumuka Geleyara Balaga",
      am: parsedAmount.toFixed(2),
      cu: "INR",
      tn: `Ganeshotsava donation from ${donorName.trim() || "devotee"}`,
    });
    return `upi://pay?${params.toString()}`;
  }

  async function handlePayNow() {
    if (!isValidAmount) {
      setError("Please enter a valid amount (minimum ₹1).");
      return;
    }
    if (!upiId) {
      setError("UPI ID not configured. Please use QR code to donate.");
      return;
    }

    setError("");
    setLoading(true);

    // Record the donation initiation
    try {
      await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim() || "Anonymous Devotee",
          amount: parsedAmount,
          upiId,
          note: `UPI deep link donation`,
        }),
      });
    } catch {
      // Non-critical — proceed even if recording fails
    }

    setLoading(false);
    setStep("paying");

    // Open the UPI deep link
    const link = buildUpiLink();
    window.location.href = link;

    // After 3 seconds, assume user has switched to UPI app — show confirmation screen
    setTimeout(() => setStep("done"), 3000);
  }

  function handleReset() {
    setStep("enter");
    setAmount("");
    setDonorName("");
    setError("");
  }

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
        <div className="max-w-[640px] mx-auto">
          <div className="bg-cream-light border border-[#eadfc9] rounded-2xl shadow-[0_12px_40px_rgba(64,36,15,0.08)] overflow-hidden">

            {/* Tab Header */}
            <div className="flex border-b border-[#eadfc9]">
              <button
                onClick={() => { setActiveTab("upi"); setStep("enter"); setError(""); }}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  activeTab === "upi"
                    ? "bg-cream-light text-text-body border-b-2 border-gold"
                    : "bg-[#fdf8ee] text-text-muted hover:text-text-body"
                }`}
              >
                📱 Pay via UPI
              </button>
              <button
                onClick={() => setActiveTab("qr")}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  activeTab === "qr"
                    ? "bg-cream-light text-text-body border-b-2 border-gold"
                    : "bg-[#fdf8ee] text-text-muted hover:text-text-body"
                }`}
              >
                📷 Scan QR Code
              </button>
            </div>

            {/* UPI TAB */}
            {activeTab === "upi" && (
              <div className="p-7">

                {/* STEP: Enter amount */}
                {step === "enter" && (
                  <div className="space-y-5">
                    {/* Quick amounts */}
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                        Select or enter amount
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {QUICK_AMOUNTS.map((a) => (
                          <button
                            key={a}
                            onClick={() => setAmount(String(a))}
                            className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                              amount === String(a)
                                ? "bg-gold text-maroon-deep border-gold shadow-sm"
                                : "bg-white border-[#e0d5c0] text-text-body hover:border-gold hover:bg-[#fdf7ea]"
                            }`}
                          >
                            ₹{a.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>

                      {/* Custom amount input */}
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-semibold text-lg">₹</span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={amount}
                          onChange={(e) => { setAmount(e.target.value); setError(""); }}
                          placeholder="Enter custom amount"
                          className="w-full pl-9 pr-4 py-3.5 border-2 border-[#e0d5c0] focus:border-gold rounded-xl text-text-body text-base font-semibold focus:outline-none bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Donor name (optional) */}
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        Your name <span className="text-text-muted font-normal normal-case">(optional)</span>
                      </p>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 border border-[#e0d5c0] focus:border-gold rounded-xl text-text-body text-sm focus:outline-none bg-white transition-colors"
                      />
                    </div>

                    {/* UPI ID display */}
                    {upiId && (
                      <div className="bg-[rgba(217,169,70,0.08)] rounded-xl p-4 flex items-center gap-3">
                        <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-lg">🕉️</span>
                        </div>
                        <div>
                          <p className="text-[0.72rem] text-text-muted">Paying to</p>
                          <p className="font-mono font-bold text-text-body text-sm">{upiId}</p>
                          <p className="text-[0.72rem] text-text-muted">{data.upiName}</p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        ⚠️ {error}
                      </p>
                    )}

                    {/* Amount preview + Pay button */}
                    <div>
                      {isValidAmount && (
                        <div className="text-center mb-4">
                          <p className="text-text-muted text-xs">You are donating</p>
                          <p className="font-[var(--font-heading)] text-3xl text-text-body font-bold">
                            ₹{parsedAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={handlePayNow}
                        disabled={loading || !isValidAmount}
                        className="w-full py-4 bg-gradient-to-r from-maroon to-maroon-deep text-gold-light font-bold text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-gold-light border-t-transparent rounded-full animate-spin" />
                            Opening UPI...
                          </span>
                        ) : (
                          <>💳 Pay {isValidAmount ? `₹${parsedAmount.toLocaleString("en-IN")}` : ""} via UPI</>
                        )}
                      </button>
                      <p className="text-center text-text-muted text-[0.72rem] mt-3">
                        Opens PhonePe, GPay, Paytm or any UPI app
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP: Paying (UPI app should be open) */}
                {step === "paying" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <span className="text-3xl">📱</span>
                    </div>
                    <h3 className="font-[var(--font-heading)] text-xl text-text-body">
                      Complete in your UPI app
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      Your UPI app should have opened. Complete the payment of{" "}
                      <strong className="text-text-body">₹{parsedAmount.toLocaleString("en-IN")}</strong>{" "}
                      using your UPI PIN.
                    </p>
                    <p className="text-text-muted text-xs">
                      If the app didn&apos;t open,{" "}
                      <a href={buildUpiLink()} className="text-gold underline hover:text-gold-muted">
                        click here to retry
                      </a>
                    </p>
                    <button onClick={() => setStep("done")} className="text-xs text-text-muted underline hover:text-text-light transition-colors">
                      I&apos;ve completed the payment →
                    </button>
                  </div>
                )}

                {/* STEP: Done */}
                {step === "done" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-3xl">🙏</span>
                    </div>
                    <h3 className="font-[var(--font-heading)] text-xl text-text-body">
                      Thank You for Your Seva!
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs mx-auto">
                      Your generous contribution of{" "}
                      <strong className="text-text-body">₹{parsedAmount.toLocaleString("en-IN")}</strong>{" "}
                      helps us celebrate Ganeshotsava for the entire community.
                    </p>
                    <div className="bg-[rgba(217,169,70,0.08)] rounded-xl p-4 text-sm text-text-light">
                      <p>🕉️ May Lord Ganesha bless you and your family.</p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="text-xs text-gold hover:text-gold-muted underline transition-colors"
                    >
                      Make another donation
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* QR TAB */}
            {activeTab === "qr" && (
              <div className="p-7 text-center">
                <p className="text-text-light text-sm leading-relaxed mb-6">
                  Scan the QR code below using PhonePe, GPay, Paytm, or any UPI app to contribute.
                </p>

                {data.qrImageUrl ? (
                  <div className="bg-white rounded-xl p-4 inline-block mb-5 shadow-md">
                    <img
                      src={data.qrImageUrl}
                      alt="Donation QR Code"
                      className="max-w-[220px] w-full h-auto object-contain"
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

                {upiId && (
                  <div className="bg-[rgba(217,169,70,0.08)] rounded-lg p-4">
                    <p className="text-sm text-text-light mb-1">Or pay directly to UPI ID</p>
                    <p className="font-mono text-text-body font-semibold text-base">{upiId}</p>
                    {data.upiName && (
                      <p className="text-sm text-text-muted mt-1">{data.upiName}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer note */}
            <div className="px-7 pb-6 pt-0 text-center">
              <p className="text-text-muted text-[0.72rem] leading-relaxed">
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
