"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from sessionStorage (set after successful API login)
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("adminUser");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
    setLoading(false);
  }, []);

  /**
   * Login by calling the server-side API route.
   * Credentials are checked against ADMIN_EMAIL + ADMIN_PASSWORD env vars.
   * Sets an HttpOnly cookie on the server and stores user in sessionStorage.
   */
  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Invalid email or password.");
    }

    const sessionUser = { email: data.email };
    setUser(sessionUser);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("adminUser", JSON.stringify(sessionUser));
    }
    return sessionUser;
  };

  /**
   * Logout — clears server cookie + client session.
   */
  const logout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("adminUser");
    }
    try {
      await fetch("/api/auth/logout", { method: "POST" });
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
