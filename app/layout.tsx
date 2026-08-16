import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Riverwood Villa Weligama | Private Riverside Villa",
    template: "%s | Riverwood Villa Weligama",
  },
  description:
    "Riverwood Villa Weligama is a private riverside boutique stay with balcony rooms, hosted meals, tropical gardens and fast Starlink Wi-Fi in Weligama, Sri Lanka.",
  keywords: ["Riverwood Villa Weligama", "Weligama villa", "villa in Weligama", "riverside villa Sri Lanka", "boutique stay Weligama", "private villa Weligama", "Weligama accommodation"],
  authors: [{ name: "Riverwood Villa Weligama", url: site.url }],
  creator: "Riverwood Villa Weligama",
  publisher: "Riverwood Villa Weligama",
  alternates: { canonical: site.url },
  icons: {
    icon: [
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/brand/favicon.ico",
    apple: "/brand/apple-touch-icon.png",
  },
  manifest: "/brand/site.webmanifest",
  openGraph: {
    title: "Riverwood Villa Weligama | Private Riverside Villa",
    description: "A private riverside boutique stay with balcony rooms, hosted meals, tropical gardens and fast Starlink Wi-Fi in Weligama, Sri Lanka.",
    url: site.url,
    siteName: "Riverwood Villa",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Riverwood Villa Weligama beside the river in Sri Lanka",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riverwood Villa Weligama | Private Riverside Villa",
    description: "Stay beside the river at Riverwood Villa Weligama, a private boutique villa on Sri Lanka's south coast.",
    images: ["/og.png"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LodgingBusiness", "Hotel"],
  "@id": `${site.url}/#riverwood-villa`,
  name: site.name,
  alternateName: "Riverwood Villa",
  image: [`${site.url}/villa/villa-hero.webp`, `${site.url}/og.png`],
  logo: `${site.url}/brand/riverwood-logo.png`,
  description: "A private riverside boutique villa with balcony rooms, hosted meals, tropical gardens and Starlink Wi-Fi in Weligama, Sri Lanka.",
  url: site.url,
  telephone: site.phone,
  email: site.email,
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
    longitude: 80.428
  },
  priceRange: "$$",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Riverside setting", value: true },
    { "@type": "LocationFeatureSpecification", name: "Starlink Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Private balconies", value: true },
  ],
};

import { PageTracker } from "@/components/analytics/PageTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${manrope.variable} ${bodoni.variable}`}>
        {children}
        <PageTracker />
      </body>
    </html>
  );
}
