import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketingShell } from "@/components/site/MarketingShell";
import { PageHero } from "@/components/site/PageHero";
import { breadcrumbJsonLd, createPageMetadata, site } from "@/lib/site";
import { faqPageJsonLd, standaloneJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Things to Do in Weligama | Riverwood Villa Local Travel Guide",
  description:
    "Discover the best things to do in Weligama: surf Weligama Bay, see Taprobane Island, visit Kushtarajagala and explore Mirissa, Midigama and Galle from Riverwood Villa.",
  path: "/things-to-do-in-weligama",
  keywords: ["things to do in Weligama", "Weligama attractions", "Weligama travel guide", "Weligama surfing", "Riverwood Villa Weligama", "best places Weligama"],
});

const places = [
  { name: "Weligama Bay", label: "Surf & beach", copy: "A broad sandy bay known for surf schools, fishing boats and long tropical sunsets. It is the natural first stop for new visitors.", image: "/blog/weligama-bay.png", alt: "Aerial view of Weligama Bay near Riverwood Villa" },
  { name: "Taprobane Island", label: "Weligama icon", copy: "The small private island just offshore is Weligama's unmistakable postcard view. Admire and photograph it from the public beach.", image: "/blog/Taprobane-island.png", alt: "Taprobane Island in Weligama Bay" },
  { name: "Kushtarajagala", label: "Culture", copy: "A monumental rock-carved figure offers a quiet encounter with the deep Buddhist and artistic history of southern Sri Lanka.", image: "/blog/kushtarajagala.png", alt: "Kushtarajagala rock carving in Weligama" },
  { name: "Midigama coast", label: "Surf progression", copy: "Travel west for reef breaks, small cafés and a different surf rhythm. The breaks suit experienced surfers more than first-time learners.", image: "/blog/surf-on-midigama.png", alt: "Surf break at Midigama near Weligama" },
  { name: "Mirissa", label: "Ocean day", copy: "Head east for whale-watching departures, beach coves and headland views. Choose licensed, wildlife-conscious operators.", image: "/blog/mirissa-whale-watching.png", alt: "Whale watching from Mirissa near Weligama" },
  { name: "Galle Fort", label: "Day trip", copy: "Walk the UNESCO-listed ramparts, narrow streets and colonial architecture, then return to Riverwood for a riverside evening.", image: "/blog/galle-fort.png", alt: "Galle Fort lighthouse on a day trip from Weligama" },
];

const faqs = [
  { question: "What is Weligama best known for?", answer: "Weligama is best known for its broad surf bay, beginner-friendly surf culture, fishing life and the distinctive view of Taprobane Island. It is also a convenient base for Midigama, Mirissa and Galle." },
  { question: "Is Weligama good for beginner surfers?", answer: "Weligama Bay is widely used for beginner lessons because it has a sandy bottom and often gentler waves. Conditions still change daily, so learn with a reputable local instructor and follow safety advice." },
  { question: "How long should I stay in Weligama?", answer: "Three days covers the bay, town and one nearby excursion. Four or five days gives you time for surfing, Mirissa or Galle, changing weather and a restful day at Riverwood Villa." },
  { question: "Where should I stay in Weligama for a quieter trip?", answer: "Riverwood Villa Weligama offers a calm riverside base in Pelana, within reach of the beach and town but away from the busiest beachfront atmosphere." },
];

export default function ThingsToDoInWeligamaPage() {
  const destinationJsonLd = { "@type": "TouristDestination", name: "Weligama", description: "A south-coast Sri Lankan destination known for surfing, fishing culture, beaches and Taprobane Island.", url: `${site.url}/things-to-do-in-weligama`, touristType: ["Surfers", "Beach travellers", "Culture travellers", "Families"] };
  const faqJsonLd = faqPageJsonLd(faqs);

  return (
    <MarketingShell>
      <JsonLd data={[...standaloneJsonLd([destinationJsonLd, faqJsonLd]), breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Things to do in Weligama", path: "/things-to-do-in-weligama" }])]} />
      <main>
        <PageHero
          eyebrow="A local guide by Riverwood Villa"
          title={<>Things to do in <em>Weligama</em></>}
          description="Surf the bay, follow the fishing coast, discover ancient art and return to the riverside calm of Riverwood Villa Weligama."
          image="/blog/weligama-surf-sunset.png"
          imageAlt="Weligama Bay at sunset, close to Riverwood Villa Weligama"
          secondaryHref="/blog/weligama-travel-guide-riverwood-villa"
          secondaryLabel="Read the complete travel guide"
        />

        <section className="mp-intro" data-reveal>
          <span className="mp-section-number">01 / Meet Weligama</span>
          <div><h2>The south coast,<br /><em>easy to enter.</em></h2><p className="mp-lead">Weligama means “sandy village,” but the town is more layered than its famous bay. Surf schools, working boats, ancient sculpture, markets and easy coastal day trips all meet here.</p><p>Riverwood Villa Weligama gives you a quiet home base for those discoveries. Start near the bay, choose one direction along the coast, and keep enough time to return before the last river light.</p></div>
        </section>

        <section className="mp-place-grid" aria-label="Top places to visit in and around Weligama">
          {places.map((place, index) => (
            <article data-reveal key={place.name}>
              <figure><Image src={place.image} alt={place.alt} fill sizes="(max-width: 720px) 100vw, 50vw" /></figure>
              <div><span>{String(index + 1).padStart(2, "0")} · {place.label}</span><h2>{place.name}</h2><p>{place.copy}</p></div>
            </article>
          ))}
        </section>

        <section className="mp-day-plan" data-reveal>
          <div><span className="mp-section-number">02 / One balanced day</span><h2>Bay to river,<br /><em>without rushing</em></h2></div>
          <ol>
            <li><time>Early morning</time><strong>Weligama Bay</strong><p>Walk the shore or take a guided surf lesson before the day warms up.</p></li>
            <li><time>Late morning</time><strong>Taprobane & Kushtarajagala</strong><p>See Weligama's iconic island view and its remarkable rock-carved figure.</p></li>
            <li><time>Afternoon</time><strong>Slow coastal lunch</strong><p>Choose a local stop, then leave breathing room rather than adding another long drive.</p></li>
            <li><time>Golden hour</time><strong>Riverwood Villa</strong><p>Return for balcony light, river air and an easy evening at the villa.</p></li>
          </ol>
        </section>

        <section className="mp-faq" aria-labelledby="weligama-faq-title">
          <header data-reveal><span className="mp-section-number">03 / Plan well</span><h2 id="weligama-faq-title">Weligama questions</h2></header>
          <div>{faqs.map((faq) => <details data-reveal key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
          <Link className="mp-text-link" href="/blog/weligama-travel-guide-riverwood-villa">Read the in-depth Weligama guide <ArrowUpRight size={15} /></Link>
        </section>
      </main>
    </MarketingShell>
  );
}
