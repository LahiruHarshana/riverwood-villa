"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  ExternalLink,
  LogOut,
  Menu,
  X,
  House,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import gsap from "gsap";

interface SidebarProps {
  currentPath: string;
}

const navItems = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Rooms", path: "/admin/rooms", icon: BedDouble },
  { label: "Bookings", path: "/admin/bookings", icon: CalendarDays },
];

export function Sidebar({ currentPath }: SidebarProps) {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleSignOut = async () => await logout();

  const isActive = (path: string) => {
    if (path === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    navRefs.current.forEach((el, i) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, x: -16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            delay: 0.1 + i * 0.08,
            ease: "power3.out",
          }
        );
      }
    });
  }, []);

  const userEmail = user?.email || "";
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "A";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="admin-mobile-menu fixed top-4 right-4 z-50 md:hidden flex h-11 w-11 items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className="admin-mobile-topbar fixed left-3 right-3 top-3 z-40 md:hidden">
        <Link href="/admin" className="flex min-w-0 items-center gap-3 pr-14">
          <div className="admin-brand-mark flex h-10 w-10 shrink-0 items-center justify-center text-sm font-semibold text-white">
            R
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-tight text-gray-950">Riverwood Admin</p>
            <span className="block truncate text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gray-400">
              Villa operations
            </span>
          </div>
        </Link>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[min(21.5rem,calc(100vw-1.5rem))] md:w-[260px] z-40
          admin-sidebar
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col px-4 py-6">
          {/* Brand */}
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="mb-6 px-2 group"
          >
            <div className="flex items-center gap-3">
              <div className="admin-brand-mark flex h-9 w-9 shrink-0 items-center justify-center text-white font-semibold text-sm">
                R
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 tracking-tight truncate">
                  Riverwood
                </h2>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-gray-400 mt-0.5 truncate">
                  Admin Panel
                </p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-0.5">
            {navItems.map((item, i) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  ref={(el) => { navRefs.current[i] = el; }}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
                    ${active
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-emerald-500" />
                  )}
                  <span className={`
                    flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all duration-150
                    ${active
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-gray-400 group-hover:text-gray-600"
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="truncate">{item.label}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                  )}
                </Link>
              );
            })}

            <div className="my-3 border-t border-gray-100" />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-150 hover:bg-gray-50 hover:text-gray-900"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400">
                <House className="w-4 h-4" />
              </span>
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 ml-auto text-gray-300" />
            </a>

            {/* User profile */}
            <div className="mt-auto mb-3">
              <div className="admin-sidebar-user">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 font-semibold text-xs">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {userEmail || "Admin User"}
                  </p>
                  <p className="text-[0.6rem] font-medium uppercase tracking-wider text-gray-400 truncate">
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
              </span>
              <span>Sign Out</span>
            </button>
          </nav>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 px-2">
            <p className="text-[0.65rem] font-medium leading-5 text-gray-300 tracking-wide uppercase">
              Riverwood Villa · Private Villa
            </p>
          </div>
        </div>
      </aside>

      <nav
        className={`admin-bottom-nav fixed bottom-3 left-3 right-3 z-30 grid grid-cols-3 gap-1 transition-opacity md:hidden ${isOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
        aria-label="Admin mobile navigation"
      >
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-bottom-nav-item ${active ? "is-active" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
