import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://elevion-site.pages.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/gateway-preview", "/handwriting-preview"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
