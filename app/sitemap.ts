import type { MetadataRoute } from "next";
import { BLOG_SLUG, blogMeta } from "@/lib/blog/weligama-travel-guide";
import { getPublicRooms } from "@/lib/public-rooms";
import { site } from "@/lib/site";

const staticPages: MetadataRoute.Sitemap = [
  {
    url: site.url,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${site.url}/villa-weligama`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "monthly",
    priority: 0.95,
  },
  {
    url: `${site.url}/rooms`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    url: `${site.url}/experiences`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    url: `${site.url}/things-to-do-in-weligama`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: `${site.url}/gallery`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "monthly",
    priority: 0.75,
  },
  {
    url: `${site.url}/contact`,
    lastModified: new Date("2026-08-17"),
    changeFrequency: "yearly",
    priority: 0.8,
  },
  {
    url: `${site.url}/blog/${BLOG_SLUG}`,
    lastModified: new Date(blogMeta.modifiedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let roomEntries: MetadataRoute.Sitemap = [];

  try {
    const rooms = await getPublicRooms();
    roomEntries = rooms.map((room) => ({
      url: `${site.url}/rooms/${room.slug}`,
      lastModified: new Date("2026-08-17"),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    }));
  } catch (error) {
    console.error("Sitemap room lookup failed:", error);
  }

  return [...staticPages, ...roomEntries];
}
