import type { Metadata } from "next";
import { WeligamaTravelBlog } from "@/components/blog/WeligamaTravelBlog";
import {
  BLOG_SLUG,
  blogMeta,
  faqs,
} from "@/lib/blog/weligama-travel-guide";

const BASE_URL = "https://riverwoodvillaweligama.com";
const CANONICAL_URL = `${BASE_URL}/blog/${BLOG_SLUG}`;

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
  keywords: blogMeta.keywords,
  authors: [{ name: blogMeta.author, url: BASE_URL }],
  creator: blogMeta.author,
  publisher: blogMeta.author,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: blogMeta.title,
    description: blogMeta.description,
    url: CANONICAL_URL,
    siteName: "Riverwood Villa",
    locale: "en_US",
    type: "article",
    publishedTime: blogMeta.publishedAt,
    modifiedTime: blogMeta.modifiedAt,
    authors: [blogMeta.author],
    tags: blogMeta.keywords,
    images: [
      {
        url: `${BASE_URL}${blogMeta.ogImage}`,
        width: 1200,
        height: 630,
        alt: blogMeta.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: blogMeta.title,
    description: blogMeta.description,
    images: [`${BASE_URL}${blogMeta.ogImage}`],
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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: blogMeta.title,
  description: blogMeta.description,
  image: `${BASE_URL}${blogMeta.ogImage}`,
  datePublished: blogMeta.publishedAt,
  dateModified: blogMeta.modifiedAt,
  author: {
    "@type": "Organization",
    name: blogMeta.author,
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Riverwood Villa",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/brand/riverwood-logo.png`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": CANONICAL_URL,
  },
  keywords: blogMeta.keywords.join(", "),
  articleSection: "Travel Guide",
  inLanguage: "en",
  about: [
    { "@type": "Place", name: "Weligama", address: { "@type": "PostalAddress", addressLocality: "Weligama", addressCountry: "LK" } },
    { "@type": "LodgingBusiness", name: "Riverwood Villa", url: BASE_URL },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Travel Journal",
      item: `${BASE_URL}/blog/weligama-travel-guide-riverwood-villa`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Weligama Travel Guide",
      item: CANONICAL_URL,
    },
  ],
};

export default function WeligamaTravelGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WeligamaTravelBlog />
    </>
  );
}
