import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dispatch", "/api/", "/app"],
    },
    sitemap: "https://jeanlimo.com/sitemap.xml",
  };
}
