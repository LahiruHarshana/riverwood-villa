"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { clearSessionCookie } from "@/lib/auth";

interface SidebarProps {
  currentPath: string;
}

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Rooms", path: "/admin/rooms", icon: BedDouble },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarDays },
];

export function Sidebar({ currentPath }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await clearSessionCookie();
    await logout();
    router.push("/admin/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 text-white rounded-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar itself */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[240px] bg-[#0f172a] text-[#94a3b8] z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6">
          <h2 className="text-white text-lg font-bold mb-8">Riverwood Villa</h2>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors
                    ${active
                      ? "bg-white text-slate-900 font-medium"
                      : "text-[#94a3b8] hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-slate-700 my-4" />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-[#94a3b8] hover:text-white hover:bg-white/10"
            >
              <ExternalLink className="w-5 h-5" />
              View Site
            </a>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-[#94a3b8] hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
