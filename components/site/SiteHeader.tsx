"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { mainNavigation } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="mp-header">
      <Link className="mp-brand" href="/" aria-label="Riverwood Villa Weligama home">
        <span>Riverwood</span>
        <small>Villa Weligama</small>
      </Link>

      <nav className="mp-desktop-nav" aria-label="Main navigation">
        {mainNavigation.slice(0, 5).map((item) => (
          <Link className={pathname === item.href ? "is-active" : ""} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link className="mp-book-link" href="/#book">
        Book direct <ArrowUpRight size={15} aria-hidden="true" />
      </Link>

      <button
        className="mp-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`mp-mobile-panel ${open ? "is-open" : ""}`} id="mobile-navigation">
        <nav aria-label="Mobile navigation">
          <Link href="/">Home</Link>
          {mainNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href="/#book">Book your stay</Link>
        </nav>
      </div>
    </header>
  );
}
