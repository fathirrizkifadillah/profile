export type SchemaType =
  | "Person"
  | "WebSite"
  | "CreativeWork"
  | "BreadcrumbList";

export interface RouteDescriptor {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
}

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export interface JsonLd {
  "@context": "https://schema.org";
  "@type": SchemaType;
  [key: string]: unknown;
}
