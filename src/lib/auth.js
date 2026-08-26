"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage for a previously verified session (set after API login)
    const sessionUser = typeof window !== "undefined" ? sessionStorage.getItem("adminSessionUser") : null;
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
        setLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("adminSessionUser");
      }
    }

    // Also listen to Firebase Auth state (for when Firebase is configured)
    try {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser({ email: u.email, uid: u.uid });
        }
        // Note: we only set loading=false here if no session storage user was found
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  /**
   * Login via server-side API (env-var credentials) first.
   * Falls back to Firebase Auth if env-var credentials aren't configured.
   */
  const login = async (email, password) => {
    // 1. Try server-side API login (works with env vars, no Firebase needed)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // API login succeeded — set session user in memory/sessionStorage
        const sessionUser = { email: data.email || email, uid: "env-admin" };
        setUser(sessionUser);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("adminSessionUser", JSON.stringify(sessionUser));
        }
        return sessionUser;
      }

      // If server explicitly says to use Firebase (env vars not set), fall through
      if (!data.useFirebase) {
        // env vars are set but credentials were wrong
        throw new Error(data.error || "Invalid email or password.");
      }
    } catch (apiErr) {
      // If it's a credentials error (not a network error), throw immediately
      if (apiErr.message && !apiErr.message.includes("fetch")) {
        throw apiErr;
      }
      // Network error — fall through to Firebase attempt
    }

    // 2. Fallback: Firebase Auth (when Firebase is properly configured)
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!firebaseApiKey || firebaseApiKey === "demo-api-key") {
      throw new Error(
        "Admin credentials not configured. Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment variables."
      );
    }

    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  };

  const logout = async () => {
    // Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adminSessionUser");
    }

    // Clear server-side cookie via API
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}

    // Sign out of Firebase if applicable
    try {
      await signOut(auth);
    } catch {}

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
