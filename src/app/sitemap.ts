import type { MetadataRoute } from "next";

const pages = [
  "",
  "/houston-black-car-service",
  "/iah-airport-car-service",
  "/hou-airport-car-service",
  "/houston-to-galveston",
  "/houston-sprinter-van-service",
  "/houston-chauffeur-service",
  "/the-woodlands-car-service",
  "/sugar-land-car-service",
  "/katy-car-service",
  "/river-oaks-car-service",
  "/memorial-car-service",
  "/galleria-car-service",
  "/west-university-car-service",
  "/downtown-houston-car-service",
  "/tanglewood-car-service",
  "/energy-corridor-car-service",
  "/bellaire-car-service",
  "/houston-heights-car-service",
  "/pricing",
  "/partners",
  "/new-york",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path, i) => ({
    url: `https://jeanlimo.com${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: i === 0 ? 1 : 0.8,
  }));
}
