import type { Metadata } from "next";

export const site = {
  name: "Riverwood Villa Weligama",
  shortName: "Riverwood Villa",
  url: "https://riverwoodvillaweligama.com",
  email: "riverwoodvillaweligama@gmail.com",
  phoneDisplay: "+94 76 567 0128",
  phone: "+94765670128",
  address: "No. 47/7, Sri Sambuddathwa Jayanthi Mw, Pelana, Weligama 81700, Sri Lanka",
};

export const mainNavigation = [
  { label: "The villa", href: "/villa-weligama" },
  { label: "Rooms", href: "/rooms" },
  { label: "Experiences", href: "/experiences" },
  { label: "Weligama", href: "/things-to-do-in-weligama" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
] as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/og.png",
  keywords = [],
}: PageMetadataOptions): Metadata {
  const canonical = `${site.url}${path}`;

  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.shortName,
      locale: "en_US",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name} in Weligama, Sri Lanka` }],
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
