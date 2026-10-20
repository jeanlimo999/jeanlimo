import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "The Woodlands Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in The Woodlands for IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/the-woodlands-car-service",
  },
  openGraph: {
    title: "The Woodlands Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in The Woodlands for IAH airport transfers and corporate travel.",
    url: "https://jeanlimo.com/the-woodlands-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="The Woodlands"
      title="The Woodlands Car Service"
      intro="Private car and chauffeur service for The Woodlands residents and businesses. Jean Limo handles frequent IAH airport transfers, corporate travel, and hourly service across north Houston."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "North Houston Airport Service",
        title: "The Woodlands to IAH in 25–35 Minutes",
        body: "Most trips take 25–35 minutes depending on traffic. We monitor flights and time pickups accordingly.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "IAH Airport Transfers", body: "Frequent route from The Woodlands. Flight monitoring available." },
        { title: "Hobby Airport", body: "Door-to-door service available." },
        { title: "Corporate Travel", body: "Reliable transportation for local businesses." },
        { title: "Hourly Chauffeur", body: "Multiple stops across north Houston." },
        { title: "Sedan, SUV, Sprinter", body: "Vehicle options for individuals and groups." },
        { title: "Galveston Transfers", body: "Cruise port service available." },
      ]}
      points={[
        "IAH transfers typically 25–35 minutes",
        "Hobby Airport service",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur available",
        "Professional drivers",
      ]}
      sections={[
        {
          heading: "Popular Services from The Woodlands",
          body: "Airport runs to IAH are the most common request. We also handle corporate transportation, hourly service, and longer trips including Galveston cruise transfers. Nearby areas include Spring, Tomball, Conroe, and Humble.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/spring-car-service", label: "Spring" },
        { href: "/tomball-car-service", label: "Tomball" },
        { href: "/conroe-car-service", label: "Conroe" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "How long from The Woodlands to IAH?", a: "Usually 25–35 minutes depending on traffic. We monitor flights for airport pickups." },
        { q: "Do you offer hourly service in The Woodlands?", a: "Yes. Hourly chauffeur service is available with a 2-hour minimum." },
        { q: "Can I book a round trip to the airport?", a: "Yes. Book both directions in one reservation." },
      ]}
    />
  );
}
