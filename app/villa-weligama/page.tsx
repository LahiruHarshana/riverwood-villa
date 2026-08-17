import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbJsonLd, createPageMetadata, site } from "@/lib/site";
import { standaloneJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Riverwood Villa Weligama | Private Riverside Boutique Villa in Sri Lanka",
  description:
    "Discover Riverwood Villa Weligama, a private riverside boutique stay with balcony rooms, tropical gardens, hosted meals, Starlink Wi-Fi and direct booking.",
  path: "/villa-weligama",
  keywords: ["Riverwood Villa Weligama", "villa in Weligama", "private villa Weligama", "riverside villa Weligama", "boutique hotel Weligama", "best villa Weligama"],
});

const lodgingJsonLd = {
  "@type": ["LodgingBusiness", "Hotel"],
  "@id": `${site.url}/#riverwood-villa`,
  name: site.name,
  alternateName: "Riverwood Villa",
  url: `${site.url}/villa-weligama`,
  image: [
    `${site.url}/villa/villa-hero.webp`,
    `${site.url}/villa/villa-bedroom-high-ceiling.jpg`,
    `${site.url}/villa/villa-balcony-chairs-river.webp`,
  ],
  description: "A private riverside boutique villa in Weligama with balcony rooms, tropical views, hosted meals and Starlink internet.",
  telephone: site.phone,
  email: site.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 47/7, Sri Sambuddathwa Jayanthi Mw, Pelana",
    addressLocality: "Weligama",
    postalCode: "81700",
    addressRegion: "Southern Province",
    addressCountry: "LK",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Riverside setting", value: true },
    { "@type": "LocationFeatureSpecification", name: "Starlink Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Private balconies", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hosted dining", value: true },
  ],
};

const highlights = [
  ["01", "A real riverside setting", "The water runs beside the property, bringing changing light, birdlife and a gentler pace to mornings and evenings."],
  ["02", "Balconies made for staying", "Timber chairs, shaded edges and open views turn the balcony into a place for breakfast, reading and long conversations."],
  ["03", "Close to coastal Weligama", "Enjoy the surf, beach life and food of Weligama, then return to a green retreat that feels removed from the busiest streets."],
  ["04", "Connected when you need it", "Fast Starlink internet makes longer stays, remote work and easy communication possible without giving up the calm setting."],
] as const;

export default function VillaWeligamaPage() {
  return (
    <MarketingShell>
      <JsonLd data={[...standaloneJsonLd([lodgingJsonLd]), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Villa in Weligama", path: "/villa-weligama" }])]} />
      <main>
        <PageHero
          eyebrow="The signature stay in Weligama"
          title={<>Riverwood Villa <em>Weligama</em></>}
          description="A private riverside villa where Weligama's coastal energy meets tropical calm—designed for balcony mornings, shared meals and beautifully unhurried stays."
          image="/villa/villa-hero.webp"
          imageAlt="Aerial view of Riverwood Villa Weligama beside the river and tropical palms"
          secondaryHref="/gallery"
          secondaryLabel="View the villa gallery"
        />

        <section className="mp-intro" data-reveal>
          <span className="mp-section-number">01 / The place</span>
          <div>
            <h2>A villa in Weligama,<br /><em>with a rhythm of its own.</em></h2>
            <p className="mp-lead">Riverwood Villa is Weligama from a quieter point of view. The beach, surf culture and south-coast day trips are within reach, while the villa gives you river air, green space and room to slow down.</p>
            <p>Arrive through Pelana and the atmosphere changes. Palms gather around the building, balconies look into the landscape and the river gives every hour a different quality. This is not a generic stay placed near Weligama; Riverwood Villa belongs to Weligama and offers a distinct way to experience it.</p>
          </div>
        </section>

        <section className="mp-image-story is-offset" data-reveal>
          <figure className="mp-image-tall"><Image src="/villa/villa-exterior-side-river.jpg" alt="Riverwood Villa exterior and riverside balconies in Weligama" fill sizes="(max-width: 800px) 100vw, 55vw" /></figure>
          <div className="mp-story-copy">
            <span className="mp-kicker">Architecture & atmosphere</span>
            <h2>Open to river light</h2>
            <p>The villa is shaped around generous circulation, high-ceiling rooms and long balconies. White walls and warm timber keep the interiors calm; outside, the scene shifts between palms, water, birds and sunset.</p>
            <p>Families and groups can gather at long tables and shared terraces, while couples and solo travellers can find private corners for reading, tea or a quiet working morning.</p>
            <Link className="mp-text-link" href="/rooms">Explore rooms and spaces <ArrowUpRight size={15} /></Link>
          </div>
        </section>

        <section className="mp-feature-list">
          <header data-reveal>
            <span className="mp-section-number">02 / Why Riverwood</span>
            <h2>What makes the villa <em>different</em></h2>
          </header>
          <div>
            {highlights.map(([number, title, copy]) => (
              <article data-reveal key={number}>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mp-split-gallery" data-reveal>
          <figure><Image src="/villa/villa-bedroom-high-ceiling.jpg" alt="High-ceiling canopy bedroom at Riverwood Villa Weligama" fill sizes="(max-width: 800px) 100vw, 50vw" /></figure>
          <figure><Image src="/villa/villa-outdoor-restaurant.webp" alt="Outdoor riverside dining at Riverwood Villa Weligama" fill sizes="(max-width: 800px) 100vw, 50vw" /></figure>
        </section>

        <section className="mp-centered-copy" data-reveal>
          <span className="mp-section-number">03 / Stay your way</span>
          <h2>From surf mornings to <em>river evenings</em></h2>
          <p>Use Riverwood Villa as your base for Weligama Beach, beginner surf lessons, Midigama, Mirissa and Galle—or leave the day completely open. Some of the best hours here are the ones spent nowhere else.</p>
          <div className="mp-link-row">
            <Link className="mp-button" href="/things-to-do-in-weligama">Discover Weligama</Link>
            <Link className="mp-text-link" href="/experiences">Explore villa experiences</Link>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
