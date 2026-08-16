import type { MetadataRoute } from 'next';
import { BLOG_SLUG, blogMeta } from '@/lib/blog/weligama-travel-guide';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://riverwoodvillaweligama.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/rooms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/${BLOG_SLUG}`,
      lastModified: new Date(blogMeta.modifiedAt),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
