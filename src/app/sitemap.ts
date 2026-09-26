import type { MetadataRoute } from "next";

const pages = [
  "",
  "/houston-black-car-service",
  "/iah-airport-car-service",
  "/hou-airport-car-service",
  "/houston-to-galveston",
  "/houston-sprinter-van-service",
  "/houston-chauffeur-service",
  "/pricing",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path, i) => ({
    url: `https://jeanlimo.com${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: i === 0 ? 1 : 0.8,
  }));
}
