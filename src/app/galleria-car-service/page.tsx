import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Galleria Car Service | Jean Limo",
  description:
    "Private car and chauffeur service in the Galleria and Uptown area for airport transfers, shopping, corporate travel, and events. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/galleria-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Galleria / Uptown"
      title="Houston Galleria Car Service"
      intro="Jean Limo provides private car service for the Galleria and Uptown area. We handle airport transfers, shopping trips, corporate meetings, and special events with professional chauffeurs and clear flat-rate pricing."
      points={[
        "Airport transfers to IAH and Hobby from the Galleria area",
        "Convenient for hotels, offices, and shopping",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for multiple stops",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Why the Galleria Area",
          body: "The Galleria is a major business and retail hub. Many clients book for airport runs, hotel transfers, and hourly service that covers meetings plus shopping or dining. Typical IAH transfers take 25–40 minutes.",
        },
      ]}
      faqs={[
        {
          q: "Do you pick up from Galleria hotels?",
          a: "Yes. We regularly serve hotels and residences in the Galleria and Uptown area.",
        },
        {
          q: "Is hourly service useful here?",
          a: "Yes. Many clients use hourly service for a combination of meetings, shopping, and dining.",
        },
      ]}
    />
  );
}
