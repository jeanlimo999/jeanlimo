import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Katy for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers across west Houston.",
  alternates: {
    canonical: "https://jeanlimo.com/katy-car-service",
  },
  openGraph: {
    title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Katy for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers across west Houston.",
    url: "https://jeanlimo.com/katy-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Katy"
      title="Katy Car Service"
      intro="Jean Limo provides private car and chauffeur service for Katy and the west Houston area. We specialize in airport transfers to IAH and Hobby, corporate transportation, hourly as-directed service, and special events with clear flat-rate pricing and professional chauffeurs."
      points={[
        "IAH and Hobby airport transfers from Katy",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Galveston cruise transfers available",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Katy",
          body: "Airport runs (IAH is a common request), corporate travel, and hourly service for multiple stops in west Houston. We also handle longer trips and cruise port transfers.",
        },
        {
          heading: "Why Choose Jean Limo in Katy",
          body: "Transparent pricing, reliable timing, and a team that handles the details so your trip is straightforward. Book online for an instant quote.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        { href: "/cypress-car-service", label: "Cypress" },
        { href: "/fulshear-car-service", label: "Fulshear" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/houston-black-car-service", label: "Black Car" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        {
          q: "How long from Katy to IAH?",
          a: "Usually 40–55 minutes depending on traffic. We monitor flights for airport pickups.",
        },
        {
          q: "Do you serve Katy for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum.",
        },
        {
          q: "Can I book from Katy to the Galleria or Downtown?",
          a: "Yes. We handle point-to-point trips throughout Greater Houston.",
        },
      ]}
    />
  );
}
