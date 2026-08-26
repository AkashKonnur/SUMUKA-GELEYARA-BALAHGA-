"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";

// Inner component that uses useSearchParams (must be in Suspense)
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If already logged in, redirect to admin
  useEffect(() => {
    if (user) {
      const from = searchParams.get("from") || "/admin";
      router.replace(from);
    }
  }, [user, router, searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const from = searchParams.get("from") || "/admin";
      router.push(from);
    } catch (err) {
      const msg = err.message || "Failed to sign in.";
      // Provide user-friendly messages without leaking system details
      if (
        msg.includes("invalid-credential") ||
        msg.includes("user-not-found") ||
        msg.includes("Invalid email or password")
      ) {
        setError("Invalid email or password. Please try again.");
      } else if (msg.includes("not configured")) {
        setError(
          "Admin credentials are not configured on this server. Please contact the administrator."
        );
      } else {
        setError("Unable to sign in. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-5 p-3.5 bg-red-950/80 border border-red-800/60 rounded-lg text-xs text-red-200 flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#d4c5b0] mb-1.5 uppercase tracking-wider">
            Admin Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            autoComplete="email"
            className="w-full bg-[#0d0704] border border-[rgba(217,169,70,0.25)] focus:border-gold rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#d4c5b0] mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full bg-[#0d0704] border border-[rgba(217,169,70,0.25)] focus:border-gold rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary !py-3 !text-sm font-bold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-maroon-deep border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </span>
          ) : (
            "Sign In to Dashboard →"
          )}
        </button>
      </form>
    </>
  );
}

// Outer page — wraps LoginForm in Suspense (required for useSearchParams)
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0604] flex items-center justify-center p-4">
      {/* Background radial highlight */}
      <div className="absolute w-[500px] h-[500px] bg-maroon opacity-20 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#160d08] border border-[rgba(217,169,70,0.25)] rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <span className="text-5xl text-gold block mb-3">ॐ</span>
          <h1 className="font-[var(--font-kannada)] text-xl text-gold-light font-bold">
            ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ
          </h1>
          <p className="text-xs text-muted tracking-widest mt-1">ADMIN CMS PORTAL</p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[rgba(217,169,70,0.3)] to-transparent" />
        </div>

        <Suspense fallback={<div className="text-center text-xs text-muted py-4">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-[0.72rem] text-text-muted text-center leading-relaxed">
          <p>Access restricted to authorised administrators only.</p>
          <a
            href="/"
            className="inline-block mt-2 text-gold/60 hover:text-gold transition-colors"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
