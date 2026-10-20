import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Katy for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur across west Houston.",
  alternates: {
    canonical: "https://jeanlimo.com/katy-car-service",
  },
  openGraph: {
    title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Katy for airport transfers and corporate travel.",
    url: "https://jeanlimo.com/katy-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Katy"
      title="Katy Car Service"
      intro="Private car and chauffeur service for Katy and west Houston. Jean Limo specializes in airport transfers to IAH and Hobby, corporate transportation, and hourly service with clear pricing."
      image="/katy.png"
      highlight={{
        kicker: "West Houston Airport Runs",
        title: "Katy to IAH Typically 40–55 Minutes",
        body: "We monitor flights and time pickups with buffer for traffic on the Katy Freeway and surrounding roads.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "IAH & Hobby", body: "Airport transfers from Katy and west Houston." },
        { title: "Corporate Travel", body: "Business transportation for local companies." },
        { title: "Hourly Chauffeur", body: "Multiple stops across Katy and the Energy Corridor." },
        { title: "Galveston Transfers", body: "Cruise port service available." },
        { title: "Sedan, SUV, Sprinter", body: "Options for individuals and groups." },
        { title: "Nearby Areas", body: "Energy Corridor, Cypress, and Fulshear." },
      ]}
      points={[
        "Airport transfers to IAH and Hobby",
        "Corporate and hourly service",
        "Sedan, SUV, and Sprinter options",
        "Galveston cruise transfers",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Katy",
          body: "Airport runs to IAH are frequent. We also handle trips to the Galleria, Downtown, Energy Corridor, and Galveston. Nearby communities include Cypress and Fulshear.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/cypress-car-service", label: "Cypress" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "How long from Katy to IAH?", a: "Usually 40–55 minutes depending on traffic. We monitor flights for airport pickups." },
        { q: "Do you offer hourly service in Katy?", a: "Yes. Hourly chauffeur service is available with a 2-hour minimum." },
        { q: "Can I book from Katy to the Galleria or Downtown?", a: "Yes. We handle point-to-point trips throughout Greater Houston." },
      ]}
    />
  );
}
