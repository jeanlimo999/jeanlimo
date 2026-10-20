import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Tanglewood Private Chauffeur | Jean Limo",
  description:
    "Private chauffeur service in Tanglewood for airport transfers, events, and personal travel. Professional drivers and flat rates in this Houston neighborhood.",
  alternates: {
    canonical: "https://jeanlimo.com/tanglewood-car-service",
  },
  openGraph: {
    title: "Tanglewood Private Chauffeur | Jean Limo",
    description:
      "Private chauffeur service in Tanglewood for airport transfers, events, and personal travel. Professional drivers and flat rates in this Houston neighborhood.",
    url: "https://jeanlimo.com/tanglewood-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Tanglewood"
      title="Tanglewood Private Chauffeur"
      intro="Jean Limo offers private chauffeur service for Tanglewood residents. We provide airport transfers, event transportation, and personal travel with a focus on reliability and discretion."
      points={[
        "Airport transfers to IAH and Hobby from Tanglewood",
        "Discreet residential service",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service available",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Local Notes",
          body: "Tanglewood is an established residential area near the Galleria. Airport runs are common. IAH transfers typically take 30–45 minutes depending on traffic.",
        },
      ]}
      faqs={[
        {
          q: "Do you serve Tanglewood for airport pickups?",
          a: "Yes. We handle both IAH and Hobby transfers from the area.",
        },
      ]}
    />
  );
}
