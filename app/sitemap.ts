import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://elevion-site.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date("2026-10-02") }];
}
