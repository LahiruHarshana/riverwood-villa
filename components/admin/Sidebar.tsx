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
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 bg-[#151512] text-[#fffdf7] rounded-full shadow-lg"
        aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#151512]/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar itself */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[272px] bg-[#151512] text-[#d8d6cc] z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 font-serif text-xl text-[#fffdf7]">
              R
            </div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#9ca592]">
              Private Villa
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium leading-none tracking-[-0.04em] text-[#fffdf7]">
              Riverwood<br />Admin
            </h2>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-colors
                    ${active
                      ? "bg-[#f6f5f1] text-[#151512] shadow-sm"
                      : "text-[#d8d6cc] hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="my-4 border-t border-white/10" />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-[#d8d6cc] transition-colors hover:bg-white/10 hover:text-white"
            >
              <ExternalLink className="w-5 h-5" />
              View Site
            </a>

            <button
              onClick={handleSignOut}
              className="mt-auto flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold text-[#d8d6cc] transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>

          <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-5 text-[#8f9388]">
            Calm property operations for bookings, rooms, and guest communication.
          </p>
        </div>
      </aside>
    </>
  );
}
