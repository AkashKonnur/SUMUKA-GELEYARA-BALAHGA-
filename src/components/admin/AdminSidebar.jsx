"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Events (Day 1/2/3)", href: "/admin/events", icon: "📅" },
  { label: "Live Announcements", href: "/admin/announcements", icon: "📢" },
  { label: "Photo Gallery", href: "/admin/gallery", icon: "📸" },
  { label: "11-Year Journey", href: "/admin/journey", icon: "⏳" },
  { label: "Donation QR & UPI", href: "/admin/donation", icon: "💳" },
  { label: "Donations Log (Private)", href: "/admin/donations-log", icon: "📝" },
  { label: "Map & Location", href: "/admin/location", icon: "📍" },
  { label: "Site Info & Contact", href: "/admin/site-info", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#140c07] border-r border-[rgba(217,169,70,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-40">
      {/* Brand */}
      <div className="p-6 border-b border-[rgba(217,169,70,0.12)]">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-gold">ॐ</span>
          <div>
            <h2 className="font-[var(--font-kannada)] text-sm text-gold-light font-bold">
              ಸುಮುಖ ಗೆಳೆಯರ ಬಳಗ
            </h2>
            <p className="text-[0.68rem] text-muted tracking-wider">ADMIN CMS PANEL</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                active
                  ? "bg-gold text-maroon-deep font-bold shadow-md"
                  : "text-[#cbbda9] hover:bg-[rgba(217,169,70,0.08)] hover:text-gold-light"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User / Sign Out */}
      <div className="p-4 border-t border-[rgba(217,169,70,0.12)] bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between text-xs">
          <div className="truncate mr-2">
            <p className="text-[0.65rem] text-muted">LOGGED IN AS</p>
            <p className="text-[#e2d5c2] font-mono truncate">{user?.email || "Admin"}</p>
          </div>
          <button
            onClick={() => logout()}
            className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded border border-red-800/40 text-[0.7rem] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
