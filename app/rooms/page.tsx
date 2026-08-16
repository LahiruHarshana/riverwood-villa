import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, BedDouble, Coffee, Trees, Wifi } from "lucide-react";
import { BookingSearch } from "@/components/booking/BookingSearch";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbJsonLd, createPageMetadata, site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Rooms at Riverwood Villa Weligama | Book Direct",
  description: "Explore calm rooms at Riverwood Villa Weligama with canopy beds, high ceilings, balcony access, riverside views and direct-booking availability.",
  path: "/rooms",
  keywords: ["Riverwood Villa rooms", "rooms in Weligama", "Weligama accommodation", "boutique rooms Weligama", "book villa Weligama"],
});

const roomFaqs = [
  { question: "Where is Riverwood Villa located?", answer: "Riverwood Villa is in Pelana, Weligama, on Sri Lanka's south coast. The villa offers a green riverside setting within easy reach of Weligama's beach and town." },
  { question: "Do rooms at Riverwood Villa have Wi-Fi?", answer: "Yes. Riverwood Villa uses Starlink satellite internet, suitable for everyday browsing, streaming and remote-work needs." },
  { question: "How can I book a room at Riverwood Villa Weligama?", answer: "Use the direct availability form on this page, or contact Riverwood Villa by phone, email or WhatsApp. Direct enquiries make it easier to discuss room fit and stay details." },
  { question: "Is Riverwood Villa suitable for longer stays?", answer: "The quiet setting, shared spaces and fast internet make Riverwood Villa a comfortable base for longer Weligama stays, subject to room availability." },
];

export default function RoomsPage() {
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: roomFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const pageJsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Rooms at Riverwood Villa Weligama", url: `${site.url}/rooms`, about: { "@id": `${site.url}/#riverwood-villa` } };

  return (
    <MarketingShell>
      <JsonLd data={[pageJsonLd, faqJsonLd, breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Rooms", path: "/rooms" }])]} />
      <main>
        <PageHero
          eyebrow="Sleep beside the river"
          title={<>Rooms at Riverwood Villa <em>Weligama</em></>}
          description="Airy rooms, warm timber, canopy beds and balcony access—quiet spaces made for deep rest after a day on Sri Lanka's south coast."
          image="/villa/villa-bedroom-canopy.jpg"
          imageAlt="Canopy bedroom with balcony access at Riverwood Villa Weligama"
          secondaryHref="/gallery"
          secondaryLabel="See every space"
        />

        <section className="mp-intro" data-reveal>
          <span className="mp-section-number">01 / Rooms</span>
          <div>
            <h2>Wake slowly.<br /><em>The river can wait.</em></h2>
            <p className="mp-lead">Rooms at Riverwood Villa Weligama are simple in the best sense: generous beds, high ceilings, useful furniture and a close connection to the outdoors.</p>
            <p>Rather than sealing you away from the setting, the rooms lead naturally toward balconies, shared verandas and the tropical landscape. The result is a stay that feels spacious, calm and unmistakably connected to Weligama.</p>
          </div>
        </section>

        <section className="mp-room-showcase">
          <figure className="mp-room-main" data-reveal><Image src="/villa/villa-bedroom-high-ceiling.jpg" alt="High ceiling guest room at Riverwood Villa in Weligama" fill sizes="(max-width: 900px) 100vw, 62vw" /></figure>
          <figure className="mp-room-small" data-reveal><Image src="/villa/villa-bedroom-desk.jpg" alt="Bedroom desk and canopy bed at Riverwood Villa Weligama" fill sizes="(max-width: 900px) 100vw, 30vw" /></figure>
          <div className="mp-room-note" data-reveal><span>Private rest</span><p>Thoughtful rooms for couples, solo travellers, families and groups.</p></div>
        </section>

        <section className="mp-icon-features">
          <article data-reveal><BedDouble /><h3>Restful rooms</h3><p>Comfortable beds, mosquito netting and uncluttered interiors.</p></article>
          <article data-reveal><Trees /><h3>Balcony life</h3><p>Step out toward palms, garden paths and river views.</p></article>
          <article data-reveal><Wifi /><h3>Starlink Wi-Fi</h3><p>Reliable connectivity for longer stays and work days.</p></article>
          <article data-reveal><Coffee /><h3>Slow mornings</h3><p>Space for tea, breakfast and the first light of the day.</p></article>
        </section>

        <section className="mp-booking-section" id="availability" data-reveal>
          <div className="mp-booking-intro">
            <span className="mp-section-number">02 / Book direct</span>
            <h2>Find your dates at <em>Riverwood</em></h2>
            <p>Search current availability and send a direct booking request. If you need help choosing the right room, include your group details and we will guide you.</p>
          </div>
          <Suspense fallback={<div className="booking-search-loading">Loading availability…</div>}>
            <BookingSearch eyebrow="Direct availability" title="Choose your stay" />
          </Suspense>
        </section>

        <section className="mp-faq" aria-labelledby="room-faq-title">
          <header data-reveal><span className="mp-section-number">03 / Good to know</span><h2 id="room-faq-title">Room questions</h2></header>
          <div>
            {roomFaqs.map((faq) => <details data-reveal key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
          <Link className="mp-text-link" href="/contact">Ask about your stay <ArrowUpRight size={15} /></Link>
        </section>
      </main>
    </MarketingShell>
  );
}
