import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Energy Corridor Corporate Transportation | Jean Limo",
  description:
    "Private car and chauffeur service in the Energy Corridor for corporate travel, airport transfers, and executive transportation. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/energy-corridor-car-service",
  },
  openGraph: {
    title: "Energy Corridor Corporate Transportation | Jean Limo",
    description:
      "Private car and chauffeur service in the Energy Corridor for corporate travel, airport transfers, and executive transportation. Flat rates and professional drivers.",
    url: "https://jeanlimo.com/energy-corridor-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Energy Corridor"
      title="Energy Corridor Corporate Transportation"
      intro="Jean Limo provides private car and chauffeur service focused on the Energy Corridor. We handle corporate transportation, airport transfers to IAH and Hobby, and executive travel for businesses and professionals in the area."
      points={[
        "Corporate and executive transportation in the Energy Corridor",
        "IAH and Hobby airport transfers",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings and roadshows",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs and 24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Corporate Focus",
          body: "The Energy Corridor has a high concentration of offices and business travelers. We regularly handle airport runs and multi-stop corporate itineraries. IAH transfers typically take 35–50 minutes.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-black-car-service", label: "Black Car" },
        { href: "/katy-car-service", label: "Katy" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/spring-branch-car-service", label: "Spring Branch" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter" },
      ]}
      faqs={[
        {
          q: "Do you offer Energy Corridor to IAH service?",
          a: "Yes. This is a frequent request for corporate travelers.",
        },
        {
          q: "Is hourly service available for meetings?",
          a: "Yes. Hourly chauffeur service works well for multiple stops in the corridor and surrounding areas.",
        },
      ]}
    />
  );
}
