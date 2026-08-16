import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { breadcrumbJsonLd, createPageMetadata, site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Riverwood Villa Weligama | Book Your Stay",
  description: "Contact Riverwood Villa Weligama directly for room availability, group stays and booking questions. Find our phone, email and Pelana address.",
  path: "/contact",
  keywords: ["contact Riverwood Villa", "book Riverwood Villa Weligama", "Riverwood Villa phone", "Riverwood Villa address"],
});

export default function ContactPage() {
  const contactJsonLd = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Riverwood Villa Weligama", url: `${site.url}/contact`, mainEntity: { "@id": `${site.url}/#riverwood-villa` } };

  return (
    <MarketingShell>
      <JsonLd data={[contactJsonLd, breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Contact", path: "/contact" }])]} />
      <main className="mp-contact-page">
        <section className="mp-contact-hero">
          <figure><Image src="/villa/villa-exterior-front.jpg" alt="Entrance to Riverwood Villa Weligama in Pelana" fill priority sizes="(max-width: 900px) 100vw, 50vw" /></figure>
          <div>
            <span className="mp-eyebrow">Contact Riverwood Villa Weligama</span>
            <h1>Let&apos;s plan your<br /><em>riverside stay.</em></h1>
            <p>Tell us your preferred dates, number of guests and anything that would make the stay more comfortable. Direct contact is the simplest way to find the right fit.</p>
            <Link className="mp-button" href="/#book">Check availability <ArrowUpRight size={16} /></Link>
          </div>
        </section>

        <section className="mp-contact-grid">
          <a href={`tel:${site.phone}`} data-reveal><Phone /><span>Call Riverwood</span><strong>{site.phoneDisplay}</strong></a>
          <a href={`mailto:${site.email}`} data-reveal><Mail /><span>Email</span><strong>{site.email}</strong></a>
          <a href={`https://wa.me/${site.phone.replace("+", "")}`} data-reveal><MessageCircle /><span>WhatsApp</span><strong>Message the villa</strong></a>
          <div data-reveal><MapPin /><span>Find us</span><strong>{site.address}</strong></div>
        </section>

        <section className="mp-arrival" data-reveal>
          <div><span className="mp-section-number">01 / Arrival</span><h2>Pelana, Weligama<br /><em>Sri Lanka</em></h2></div>
          <div><p>Riverwood Villa is in Pelana, Weligama, giving guests access to the south coast while keeping the atmosphere calm and green. Ask us for the clearest arrival directions before you travel.</p><p>For the fastest booking response, share your arrival and departure dates, group size and a contact number.</p></div>
        </section>
      </main>
    </MarketingShell>
  );
}
