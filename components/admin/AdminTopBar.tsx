"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Crumb = { label: string; href?: string };

function getBreadcrumbs(pathname: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Overview", href: "/admin" }];

  if (pathname === "/admin") return crumbs;

  if (pathname.startsWith("/admin/rooms")) {
    crumbs.push({ label: "Rooms", href: "/admin/rooms" });
    if (pathname === "/admin/rooms/new") crumbs.push({ label: "Add room" });
    else if (pathname.includes("/edit")) crumbs.push({ label: "Edit room" });
    return crumbs;
  }

  if (pathname.startsWith("/admin/bookings")) {
    crumbs.push({ label: "Bookings", href: "/admin/bookings" });
    if (pathname !== "/admin/bookings") crumbs.push({ label: "Details" });
    return crumbs;
  }

  return crumbs;
}

function getPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname === "/admin/rooms") return "Rooms";
  if (pathname === "/admin/rooms/new") return "Add room";
  if (pathname.includes("/admin/rooms/") && pathname.includes("/edit")) return "Edit room";
  if (pathname === "/admin/bookings") return "Bookings";
  if (pathname.startsWith("/admin/bookings/")) return "Booking details";
  return "Admin";
}

export function AdminTopBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const crumbs = getBreadcrumbs(pathname);
  const pageTitle = getPageTitle(pathname);
  const userEmail = user?.email || "Administrator";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-inner">
        <div className="admin-topbar-main min-w-0">
          <nav className="admin-breadcrumb" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <span key={`${crumb.label}-${index}`} className="admin-breadcrumb-item">
                  {index > 0 && <ChevronRight className="admin-breadcrumb-separator" aria-hidden="true" />}
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span className={isLast ? "is-current" : undefined}>{crumb.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
          <p className="admin-topbar-title">{pageTitle}</p>
        </div>

        <div className="admin-topbar-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-topbar-link"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <div className="admin-topbar-user" title={userEmail}>
            <span className="admin-topbar-avatar">{userInitial}</span>
            <span className="admin-topbar-email">{userEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
