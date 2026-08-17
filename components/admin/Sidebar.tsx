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
  {
    label: "Overview",
    description: "Dashboard and metrics",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Rooms",
    description: "Inventory and pricing",
    path: "/admin/rooms",
    icon: BedDouble,
  },
  {
    label: "Bookings",
    description: "Guest requests",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
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
            <p className="truncate text-sm font-black tracking-tight" style={{ color: "var(--ra-ink-strong)" }}>
              Riverwood Admin
            </p>
            <span className="block truncate text-[0.65rem] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--ra-ink-muted)" }}>
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
          fixed top-0 left-0 h-full w-[min(21.5rem,calc(100vw-1.5rem))] md:w-[272px] z-40
          admin-sidebar
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col px-4 py-6">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="mb-8 px-2"
          >
            <div className="flex items-center gap-3">
              <div className="admin-brand-mark flex h-10 w-10 shrink-0 items-center justify-center text-white font-semibold text-sm">
                R
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black tracking-tight truncate" style={{ color: "var(--ra-ink-strong)" }}>
                  Riverwood Villa
                </h2>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] mt-0.5 truncate" style={{ color: "var(--ra-ink-muted)" }}>
                  Admin workspace
                </p>
              </div>
            </div>
          </Link>

          <div className="px-2 mb-3">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.14em]" style={{ color: "var(--ra-ink-faint)" }}>
              Main menu
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item, i) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  ref={(el) => { navRefs.current[i] = el; }}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`admin-nav-link ${active ? "is-active" : ""}`}
                >
                  <span className="admin-nav-link-icon">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.label}</span>
                    <span className="admin-nav-link-copy">{item.description}</span>
                  </span>
                  {active && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                </Link>
              );
            })}

            <div className="my-4 border-t" style={{ borderColor: "var(--ra-line)" }} />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-link"
            >
              <span className="admin-nav-link-icon">
                <House className="w-4 h-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">View site</span>
                <span className="admin-nav-link-copy">Open public website</span>
              </span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
            </a>

            <div className="mt-auto mb-3 pt-4">
              <div className="admin-sidebar-user">
                <div className="admin-topbar-avatar">{userInitial}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate" style={{ color: "var(--ra-ink-strong)" }}>
                    {userEmail || "Admin User"}
                  </p>
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider truncate" style={{ color: "var(--ra-ink-muted)" }}>
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="admin-nav-link is-danger"
            >
              <span className="admin-nav-link-icon">
                <LogOut className="w-4 h-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">Sign out</span>
                <span className="admin-nav-link-copy">End admin session</span>
              </span>
            </button>
          </nav>

          <div className="mt-4 pt-4 border-t px-2" style={{ borderColor: "var(--ra-line)" }}>
            <p className="text-[0.62rem] font-bold leading-5 tracking-wide uppercase" style={{ color: "var(--ra-ink-faint)" }}>
              Riverwood Villa · Private admin
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
