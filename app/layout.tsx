import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTracker } from "@/components/analytics/PageTracker";
import { createSiteGraph, defaultKeywords, homeFaqJsonLd } from "@/lib/seo";
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

const defaultTitle =
  "Riverwood Villa Weligama: Private Riverside Boutique Stay | Book Direct";
const defaultDescription =
  "Built for unhurried south-coast stays, Riverwood Villa Weligama offers balcony rooms beside the river, hosted meals, Starlink Wi-Fi and direct booking in Weligama, Sri Lanka.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: "%s | Riverwood Villa Weligama",
  },
  description: defaultDescription,
  keywords: [...defaultKeywords],
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
    canonical: site.url,
    languages: {
      "en-US": site.url,
    },
  },
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/favicon.svg",
    apple: [{ url: "/og.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: site.url,
    siteName: site.shortName,
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
    title: defaultTitle,
    description: defaultDescription,
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

const globalStructuredData = createSiteGraph(homeFaqJsonLd);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={globalStructuredData} />
      </head>
      <body className={`${manrope.variable} ${bodoni.variable}`}>
        {children}
        <PageTracker />
      </body>
    </html>
  );
}
