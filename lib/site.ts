import type { Metadata } from "next";
import { createAdvancedPageMetadata } from "@/lib/seo";

export { site, mainNavigation } from "@/lib/site-config";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  return createAdvancedPageMetadata(options);
}

export { breadcrumbJsonLd } from "@/lib/seo";
