import type { Metadata } from "next";
import { site } from "@/lib/site-config";

export const defaultKeywords = [
  "Riverwood Villa Weligama",
  "Weligama villa",
  "villa in Weligama",
  "best villa Weligama",
  "Weligama accommodation",
  "private villa Weligama Sri Lanka",
  "riverside villa Weligama",
  "boutique stay Weligama",
  "book villa Weligama",
  "things to do in Weligama",
] as const;

export const sitelinkPages = [
  {
    name: "Rooms at Riverwood Villa",
    description: "Explore balcony rooms and check direct availability in Weligama.",
    path: "/rooms",
  },
  {
    name: "The Villa in Weligama",
    description: "Discover the private riverside boutique stay beside Pelana.",
    path: "/villa-weligama",
  },
  {
    name: "Contact Riverwood Villa",
    description: "Book your stay, ask about dates and plan your Weligama trip.",
    path: "/contact",
  },
  {
    name: "Things to Do in Weligama",
    description: "Surf Weligama Bay, visit Taprobane Island and explore the south coast.",
    path: "/things-to-do-in-weligama",
  },
  {
    name: "Riverwood Villa Gallery",
    description: "See rooms, riverside balconies, gardens and golden evenings.",
    path: "/gallery",
  },
  {
    name: "Weligama Travel Guide",
    description: "Read the complete Riverwood travel journal for Weligama.",
    path: "/blog/weligama-travel-guide-riverwood-villa",
  },
] as const;

const organizationId = `${site.url}/#organization`;
const websiteId = `${site.url}/#website`;
const lodgingId = `${site.url}/#riverwood-villa`;

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  logo: {
    "@type": "ImageObject",
    url: `${site.url}/og.png`,
    width: 1200,
    height: 630,
  },
  image: `${site.url}/og.png`,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 47/7, Sri Sambuddathwa Jayanthi Mw, Pelana",
    addressLocality: "Weligama",
    addressRegion: "Southern Province",
    postalCode: "81700",
    addressCountry: "LK",
  },
  areaServed: {
    "@type": "City",
    name: "Weligama",
    containedInPlace: {
      "@type": "Country",
      name: "Sri Lanka",
    },
  },
  knowsAbout: [
    "Weligama travel",
    "Boutique villa stays",
    "Riverside accommodation Sri Lanka",
    "South coast Sri Lanka holidays",
  ],
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": websiteId,
  url: site.url,
  name: site.name,
  alternateName: site.shortName,
  description:
    "Official website of Riverwood Villa Weligama, a private riverside boutique stay in Pelana, Sri Lanka.",
  inLanguage: "en",
  publisher: { "@id": organizationId },
  about: { "@id": lodgingId },
  hasPart: sitelinkPages.map((page) => ({
    "@type": "WebPage",
    name: page.name,
    description: page.description,
    url: `${site.url}${page.path}`,
  })),
};

export const lodgingBusinessJsonLd = {
  "@type": ["LodgingBusiness", "Hotel"],
  "@id": lodgingId,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  image: [
    `${site.url}/villa/villa-hero.webp`,
    `${site.url}/villa/villa-bedroom-high-ceiling.jpg`,
    `${site.url}/villa/villa-balcony-chairs-river.webp`,
    `${site.url}/og.png`,
  ],
  logo: `${site.url}/og.png`,
  description:
    "A private riverside boutique villa in Weligama with balcony rooms, tropical gardens, hosted meals and Starlink Wi-Fi.",
  telephone: site.phone,
  email: site.email,
  priceRange: "$$",
  checkinTime: "14:00",
  checkoutTime: "11:00",
  currenciesAccepted: "USD, LKR",
  paymentAccepted: "Cash, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 47/7, Sri Sambuddathwa Jayanthi Mw, Pelana",
    addressLocality: "Weligama",
    addressRegion: "Southern Province",
    postalCode: "81700",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 5.973,
    longitude: 80.428,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Riverside setting", value: true },
    { "@type": "LocationFeatureSpecification", name: "Starlink Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Private balconies", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hosted dining", value: true },
    { "@type": "LocationFeatureSpecification", name: "Tropical gardens", value: true },
  ],
  parentOrganization: { "@id": organizationId },
  mainEntityOfPage: { "@id": websiteId },
};

export const siteNavigationJsonLd = {
  "@type": "ItemList",
  name: "Riverwood Villa Weligama site navigation",
  itemListElement: sitelinkPages.map((page, index) => ({
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: page.name,
    description: page.description,
    url: `${site.url}${page.path}`,
  })),
};

export function createSiteGraph(extra: object | object[] = []) {
  const extras = Array.isArray(extra) ? extra : [extra];

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd,
      websiteJsonLd,
      lodgingBusinessJsonLd,
      siteNavigationJsonLd,
      ...extras,
    ],
  };
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function createAdvancedPageMetadata({
  title,
  description,
  path,
  image = "/og.png",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
}: PageMetadataOptions): Metadata {
  const canonical = `${site.url}${path}`;
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));
  const imageAlt = `${site.name} in Weligama, Sri Lanka`;

  return {
    title: { absolute: title },
    description,
    keywords: mergedKeywords,
    applicationName: site.shortName,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "travel",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.shortName,
      locale: "en_US",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function faqPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function standaloneJsonLd(data: object | object[]) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item) => ({
    "@context": "https://schema.org",
    ...item,
  }));
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export const homeFaqJsonLd = faqPageJsonLd([
  {
    question: "Where is Riverwood Villa Weligama located?",
    answer:
      "Riverwood Villa is in Pelana, Weligama, on Sri Lanka's south coast. The property sits beside the river within easy reach of Weligama Bay, surf schools and local attractions.",
  },
  {
    question: "Why stay at Riverwood Villa in Weligama?",
    answer:
      "Riverwood Villa offers a quieter riverside setting, balcony rooms, hosted meals, tropical gardens and Starlink Wi-Fi, making it a strong choice for couples, families and longer Weligama stays.",
  },
  {
    question: "How do I book Riverwood Villa Weligama?",
    answer:
      "Use the direct availability form on the website or contact Riverwood Villa by phone, email or WhatsApp to check dates, room fit and booking details.",
  },
  {
    question: "What is the best villa to stay in Weligama?",
    answer:
      "Travellers looking for a calm boutique base often choose Riverwood Villa Weligama for its riverside location, private rooms, direct booking and easy access to Weligama beach and town.",
  },
]);
