"use client";
import { AuthProvider } from "@/lib/auth";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AuthGate from "@/components/admin/AuthGate";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        // Login page — no sidebar, no auth gate (middleware already redirects unauthenticated users)
        <div className="min-h-screen">{children}</div>
      ) : (
        // Protected admin pages — AuthGate provides client-side loading state
        <AuthGate>
          <div className="min-h-screen bg-[#0d0805] text-[#ede0ce] flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>
          </div>
        </AuthGate>
      )}
    </AuthProvider>
  );
}
