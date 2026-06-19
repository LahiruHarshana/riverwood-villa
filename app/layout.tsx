import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["300", "400", "600", "700"],
});


export const metadata: Metadata = {
  title: "Riverwood Villa | Riverside Boutique Stay",
  description:
    "A serene riverside villa stay with private rooms, warm interiors, nature views, and slow luxury hospitality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
