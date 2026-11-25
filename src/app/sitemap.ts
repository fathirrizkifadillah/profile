import type { MetadataRoute } from "next";
import { sitemapEntries } from "@/services/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = sitemapEntries("2026-11-25");
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
