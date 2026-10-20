import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Energy Corridor Corporate Transportation | Jean Limo",
  description:
    "Private car and chauffeur service in the Energy Corridor for corporate travel, airport transfers, and executive transportation.",
  alternates: {
    canonical: "https://jeanlimo.com/energy-corridor-car-service",
  },
  openGraph: {
    title: "Energy Corridor Corporate Transportation | Jean Limo",
    description:
      "Private car service in the Energy Corridor for corporate travel and airport transfers.",
    url: "https://jeanlimo.com/energy-corridor-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Energy Corridor"
      title="Energy Corridor Corporate Transportation"
      intro="Private car and chauffeur service focused on the Energy Corridor. Jean Limo handles corporate transportation, airport transfers to IAH and Hobby, and executive travel for businesses and professionals along the corridor."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Corporate Focus",
        title: "Airport Runs and Multi-Stop Itineraries",
        body: "Frequent requests include Energy Corridor to IAH (typically 35–50 minutes) and hourly service for meetings across the area.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Corporate Transportation", body: "Executive and business travel in the corridor." },
        { title: "IAH & Hobby", body: "Airport transfers for business travelers." },
        { title: "Hourly Service", body: "Multiple stops for meetings and roadshows." },
        { title: "Sedan & SUV", body: "Professional vehicles for individuals and small teams." },
        { title: "Sprinter for Groups", body: "One vehicle for larger corporate groups." },
        { title: "Nearby Coverage", body: "Katy, Memorial, and west Houston." },
      ]}
      points={[
        "Corporate and executive transportation",
        "IAH and Hobby airport transfers",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur for meetings",
        "Professional drivers",
      ]}
      sections={[
        {
          heading: "Why the Energy Corridor",
          body: "High concentration of offices and business travelers. We regularly handle airport runs and multi-stop corporate itineraries. IAH transfers typically take 35–50 minutes depending on traffic.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/katy-car-service", label: "Katy" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "Do you offer Energy Corridor to IAH service?", a: "Yes. This is a frequent request for corporate travelers. Typical time is 35–50 minutes." },
        { q: "Is hourly service available for meetings?", a: "Yes. Hourly chauffeur service works well for multiple stops." },
      ]}
    />
  );
}
