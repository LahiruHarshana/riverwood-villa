import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Riverwood Villa Experiences | Weligama Riverside Stay & Surf Days",
  description:
    "Plan riverside mornings, hosted dining, surf days, wildlife watching and remote-work stays at Riverwood Villa Weligama, the boutique riverside base on Sri Lanka's south coast.",
  path: "/experiences",
  keywords: ["Riverwood Villa experiences", "Weligama villa experiences", "riverside stay Sri Lanka", "surf stay Weligama", "workation Weligama"],
});

const experiences = [
  { number: "01", title: "River mornings", copy: "Begin with tea on the balcony, birds in the palms and soft light moving across the water. Nothing needs to happen quickly.", image: "/villa/villa-balcony-chairs-river.webp", alt: "Balcony chairs facing the river at Riverwood Villa Weligama" },
  { number: "02", title: "Hosted tables", copy: "Gather over breakfast, a shaded lunch or dinner beside the river. The setting makes even a simple meal feel like an occasion.", image: "/villa/villa-outdoor-restaurant.webp", alt: "Hosted outdoor dining at Riverwood Villa Weligama" },
  { number: "03", title: "Weligama surf days", copy: "Head to the bay for a lesson or an early paddle, then return to Riverwood for quiet shade and an unhurried afternoon.", image: "/blog/sufing-on-weligama.png", alt: "Surfing in Weligama near Riverwood Villa" },
  { number: "04", title: "Wild neighbours", copy: "Peacocks, river birds and the changing life of the water create small, unscheduled encounters around the villa.", image: "/villa/villa-peacocks-veranda.jpg", alt: "Peacocks visiting the veranda at Riverwood Villa" },
];

export default function ExperiencesPage() {
  return (
    <MarketingShell>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Experiences", path: "/experiences" }])} />
      <main>
        <PageHero
          eyebrow="The Riverwood rhythm"
          title={<>Beautiful days,<br /><em>left open</em></>}
          description="A Weligama stay shaped by river light, shared food, the south coast and enough space to follow your own pace."
          image="/villa/villa-boat-sunset.webp"
          imageAlt="Sunset boat on the river beside Riverwood Villa Weligama"
          secondaryHref="/things-to-do-in-weligama"
          secondaryLabel="Explore Weligama"
        />

        <section className="mp-intro" data-reveal>
          <span className="mp-section-number">01 / Experience Riverwood</span>
          <div><h2>Stay close to Weligama.<br /><em>Feel far from busy.</em></h2><p className="mp-lead">The best Riverwood Villa experiences are not packed into an itinerary. They appear naturally: coffee by the river, a surf session, a long lunch, an unexpected bird on the veranda.</p><p>Choose the coast when you want movement and return to the villa when you want quiet. That balance is what makes Riverwood Villa Weligama memorable.</p></div>
        </section>

        <section className="mp-experience-list">
          {experiences.map((experience, index) => (
            <article className={index % 2 ? "is-reverse" : ""} data-reveal key={experience.number}>
              <figure><Image src={experience.image} alt={experience.alt} fill sizes="(max-width: 850px) 100vw, 55vw" /></figure>
              <div><span>{experience.number}</span><h2>{experience.title}</h2><p>{experience.copy}</p></div>
            </article>
          ))}
        </section>

        <section className="mp-dark-feature" data-reveal>
          <span className="mp-section-number">02 / Work from Weligama</span>
          <h2>Connected to the world.<br /><em>Grounded by the river.</em></h2>
          <p>Starlink internet supports video calls, streaming and everyday work. When the laptop closes, your balcony and the Weligama coast are ready.</p>
          <Link className="mp-button is-light" href="/rooms">See rooms <ArrowUpRight size={15} /></Link>
        </section>
      </main>
    </MarketingShell>
  );
}
