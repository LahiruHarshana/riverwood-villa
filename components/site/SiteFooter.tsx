import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { mainNavigation, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mp-footer">
      <div className="mp-footer-lead">
        <span>Stay where Weligama slows down.</span>
        <h2>Riverwood Villa <em>Weligama</em></h2>
        <Link href="/#book">Plan your stay <ArrowUpRight size={18} /></Link>
      </div>
      <div className="mp-footer-grid">
        <div>
          <strong>Explore Riverwood</strong>
          {mainNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <strong>Contact</strong>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>
          <p>{site.address}</p>
        </div>
        <div>
          <strong>Weligama guide</strong>
          <Link href="/things-to-do-in-weligama">Things to do in Weligama</Link>
          <Link href="/blog/weligama-travel-guide-riverwood-villa">Complete travel journal</Link>
          <Link href="/villa-weligama">Villa in Weligama</Link>
        </div>
      </div>
      <div className="mp-footer-bottom">
        <span>© {new Date().getFullYear()} Riverwood Villa Weligama</span>
        <span>Private riverside boutique stay · Weligama, Sri Lanka</span>
      </div>
    </footer>
  );
}
