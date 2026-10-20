import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Memorial Houston Car Service | Jean Limo",
  description:
    "Private car service in Memorial and Memorial Villages for airport transfers, corporate travel, and hourly chauffeur.",
  alternates: {
    canonical: "https://jeanlimo.com/memorial-car-service",
  },
  openGraph: {
    title: "Memorial Houston Car Service | Jean Limo",
    description:
      "Private car service in Memorial for airport transfers and corporate travel.",
    url: "https://jeanlimo.com/memorial-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Memorial"
      title="Memorial Houston Car Service"
      intro="Private chauffeur service for Memorial and the Memorial Villages. Jean Limo provides airport transportation to IAH and Hobby, corporate travel, and hourly service for residents and businesses in this established Houston area."
      image="/memorial.jpg"
      highlight={{
        kicker: "Memorial to IAH",
        title: "Typically 35–50 Minutes",
        body: "Airport runs are a common request. We monitor flights and time pickups with appropriate buffer.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "IAH and Hobby from Memorial and Memorial Villages." },
        { title: "Corporate Travel", body: "Executive transportation for local businesses." },
        { title: "Hourly Service", body: "Multiple stops across Memorial and nearby areas." },
        { title: "Galleria & Downtown", body: "Point-to-point service to major Houston destinations." },
        { title: "Sedan, SUV, Sprinter", body: "Vehicle options for individuals and groups." },
        { title: "Local Knowledge", body: "Chauffeurs familiar with the area." },
      ]}
      points={[
        "Airport transfers from Memorial",
        "Corporate and executive transportation",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur available",
        "Professional drivers",
      ]}
      sections={[
        {
          heading: "Common Routes",
          body: "Memorial to IAH typically takes 35–50 minutes depending on traffic. We also handle trips to the Galleria, Downtown, Energy Corridor, and River Oaks.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        { href: "/river-oaks-car-service", label: "River Oaks" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "How long from Memorial to IAH?", a: "Usually 35–50 minutes depending on traffic." },
        { q: "Do you serve Memorial Villages?", a: "Yes. We cover Memorial and the surrounding villages area." },
      ]}
    />
  );
}
