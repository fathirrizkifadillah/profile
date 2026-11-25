import type { Metadata } from "next";
import { OG_IMAGE_PATH, SITE_URL } from "@/constants/seo";
import type { JsonLd, RouteDescriptor, SchemaType, SitemapEntry } from "@/types/seo";

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return SITE_URL;
  const withoutTrailing = normalized.endsWith("/")
    ? normalized.slice(0, -1)
    : normalized;
  return `${SITE_URL}${withoutTrailing}`;
}

export function buildMetadata(route: RouteDescriptor): Metadata {
  const canonical = canonicalUrl(route.path);
  const ogImageUrl = canonicalUrl(route.ogImage ?? OG_IMAGE_PATH);

  return {
    title: route.title,
    description: route.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: route.title,
      description: route.description,
      images: [ogImageUrl],
    },
  };
}

export function sitemapEntries(lastModified: string): SitemapEntry[] {
  return [
    {
      url: canonicalUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}

export function structuredData(
  type: SchemaType,
  data: Record<string, unknown>
): JsonLd {
  return { "@context": "https://schema.org", "@type": type, ...data };
}
