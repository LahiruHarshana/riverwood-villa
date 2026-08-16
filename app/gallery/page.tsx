import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Riverwood Villa Weligama Gallery | Rooms & Riverside",
  description: "See Riverwood Villa Weligama in photographs: riverside balconies, canopy rooms, tropical gardens, hosted dining, wildlife and golden evenings.",
  path: "/gallery",
  keywords: ["Riverwood Villa gallery", "Riverwood Villa Weligama photos", "Weligama villa photos", "riverside villa Sri Lanka"],
});

const gallery = [
  ["/villa/villa-exterior-side-river.jpg", "Riverwood Villa beside the river in Weligama", "River edge", "tall"],
  ["/villa/villa-bedroom-high-ceiling.jpg", "High-ceiling canopy room at Riverwood Villa", "Rooms", ""],
  ["/villa/villa-balcony-chairs-river.webp", "Balcony chairs overlooking the river", "Balcony mornings", ""],
  ["/villa/villa-outdoor-restaurant.webp", "Outdoor dining table at Riverwood Villa Weligama", "Hosted dining", "wide"],
  ["/villa/villa-peacocks-veranda.jpg", "Peacocks visiting the Riverwood Villa veranda", "Wild visitors", "tall"],
  ["/villa/villa-exterior-side-sunset.jpg", "Riverwood Villa exterior in sunset light", "Golden hour", ""],
  ["/villa/villa-long-balcony.jpg", "Long tropical balcony at Riverwood Villa", "Open air", "wide"],
  ["/villa/villa-bedroom-canopy.jpg", "Warm canopy bedroom with balcony doors", "Rest", "tall"],
  ["/villa/villa-boat-sunset.webp", "A boat at sunset near Riverwood Villa", "River evenings", ""],
  ["/villa/villa-paved-walkway.webp", "Garden walkway at Riverwood Villa Weligama", "Garden paths", ""],
  ["/villa/villa-dining-patio.jpg", "Dining table facing the river at sunset", "Shared tables", "tall"],
  ["/villa/drone-night-villa.webp", "Aerial night view of Riverwood Villa Weligama", "After dark", "wide"],
] as const;

export default function GalleryPage() {
  return (
    <MarketingShell>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Gallery", path: "/gallery" }])} />
      <main>
        <PageHero
          eyebrow="A visual journal"
          title={<>Riverwood Villa <em>in pictures</em></>}
          description="The rooms, river, balconies, wildlife and small details that make Riverwood Villa Weligama feel like nowhere else."
          image="/villa/drone-night-villa.webp"
          imageAlt="Riverwood Villa Weligama glowing beside the river at night"
          secondaryHref="/villa-weligama"
          secondaryLabel="Discover the villa"
        />

        <section className="mp-intro is-compact" data-reveal>
          <span className="mp-section-number">01 / Riverwood scenes</span>
          <div><h2>A slower Weligama,<br /><em>frame by frame.</em></h2><p className="mp-lead">Follow the light from canopy rooms to open balconies, river reflections and warm evenings around the villa.</p></div>
        </section>

        <section className="mp-gallery-grid" aria-label="Riverwood Villa Weligama photo gallery">
          {gallery.map(([src, alt, caption, shape], index) => (
            <figure className={shape ? `is-${shape}` : ""} data-reveal key={src}>
              <Image src={src} alt={alt} fill sizes={shape === "wide" ? "(max-width: 800px) 100vw, 66vw" : "(max-width: 800px) 100vw, 34vw"} />
              <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{caption}</figcaption>
            </figure>
          ))}
        </section>
      </main>
    </MarketingShell>
  );
}
