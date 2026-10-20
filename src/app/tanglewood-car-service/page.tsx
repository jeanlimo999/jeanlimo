import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Tanglewood Private Chauffeur | Jean Limo",
  description:
    "Private chauffeur service in Tanglewood for airport transfers, events, and personal travel near the Galleria.",
  alternates: {
    canonical: "https://jeanlimo.com/tanglewood-car-service",
  },
  openGraph: {
    title: "Tanglewood Private Chauffeur | Jean Limo",
    description:
      "Private chauffeur service in Tanglewood for airport transfers and events.",
    url: "https://jeanlimo.com/tanglewood-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Tanglewood"
      title="Tanglewood Private Chauffeur"
      intro="Private chauffeur service for Tanglewood residents. Jean Limo provides airport transfers, event transportation, and personal travel with a focus on reliability in this established neighborhood near the Galleria."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Near the Galleria",
        title: "Tanglewood to IAH in 30–45 Minutes",
        body: "Airport runs are common. We time pickups with buffer and offer flight monitoring.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "IAH and Hobby from Tanglewood." },
        { title: "Event Transportation", body: "Dinners, galas, and private occasions." },
        { title: "Hourly Chauffeur", body: "Multiple stops for shopping or meetings." },
        { title: "Galleria Access", body: "Convenient service to nearby Galleria destinations." },
        { title: "Sedan & SUV", body: "Discreet private vehicles." },
        { title: "Nearby Areas", body: "River Oaks, Memorial, and Galleria." },
      ]}
      points={[
        "Airport transfers from Tanglewood",
        "Event and personal travel",
        "Sedan, SUV, and Sprinter options",
        "Hourly service available",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Local Notes",
          body: "Tanglewood is an established residential area near the Galleria. Airport runs are common. IAH transfers typically take 30–45 minutes depending on traffic. We also serve nearby River Oaks and Memorial.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/river-oaks-car-service", label: "River Oaks" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "Do you serve Tanglewood for airport pickups?", a: "Yes. We handle both IAH and Hobby transfers from the area." },
        { q: "How long from Tanglewood to IAH?", a: "Typically 30–45 minutes depending on traffic." },
      ]}
    />
  );
}
