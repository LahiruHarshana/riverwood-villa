import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
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
  metadataBase: new URL('https://riverwoodvillaweligama.com'),
  title: "Riverwood Villa | Private Riverside Boutique Stay in Weligama",
  description:
    "A private riverside villa stay with warm rooms, open balconies, hosted meals, and calm tropical space for families, couples, and groups in Weligama, Sri Lanka.",
  keywords: ["Weligama villa", "riverside villa Sri Lanka", "boutique stay Weligama", "private villa Weligama", "Riverwood Villa", "Sri Lanka holiday rental", "Weligama accommodation"],
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
    title: "Riverwood Villa | Private Riverside Boutique Stay in Weligama",
    description: "A private riverside villa stay with warm rooms, open balconies, hosted meals, and calm tropical space for families, couples, and groups in Weligama, Sri Lanka.",
    url: "https://riverwoodvillaweligama.com",
    siteName: "Riverwood Villa",
    images: [
      {
        url: "/brand/riverwood-logo.png",
        width: 1200,
        height: 630,
        alt: "Riverwood Villa Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riverwood Villa | Private Riverside Boutique Stay",
    description: "A private riverside villa stay with warm rooms, open balconies, hosted meals, and calm tropical space for families, couples, and groups. Sri Lanka.",
    images: ["/brand/riverwood-logo.png"],
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
  "@type": "LodgingBusiness",
  name: "Riverwood Villa",
  image: "https://riverwoodvillaweligama.com/brand/riverwood-logo.png",
  description: "A private riverside villa stay with warm rooms, open balconies, hosted meals, and calm tropical space for families, couples, and groups in Weligama, Sri Lanka.",
  url: "https://riverwoodvillaweligama.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Weligama",
    addressRegion: "Southern Province",
    addressCountry: "LK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 5.973,
    longitude: 80.428
  },
  priceRange: "$$",
};

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
      <body className={`${manrope.variable} ${bodoni.variable}`}>{children}</body>
    </html>
  );
}
