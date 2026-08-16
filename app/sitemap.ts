import type { MetadataRoute } from 'next';
import { BLOG_SLUG, blogMeta } from '@/lib/blog/weligama-travel-guide';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://riverwoodvillaweligama.com';
  const updated = new Date('2026-08-16');
  
  return [
    {
      url: baseUrl,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/villa-weligama`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: updated,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/things-to-do-in-weligama`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: updated,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: updated,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/${BLOG_SLUG}`,
      lastModified: new Date(blogMeta.modifiedAt),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
