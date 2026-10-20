import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Pearland Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Pearland for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/pearland-car-service",
  },
  openGraph: {
    title: "Pearland Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Pearland for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
    url: "https://jeanlimo.com/pearland-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Pearland"
      title="Pearland Car Service"
      intro="Jean Limo provides private car and chauffeur service for Pearland residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby Airport transfers from Pearland",
        "IAH Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Pearland",
          body: "Most clients book airport runs to Hobby (typically 20–30 minutes) or IAH, corporate transportation, and hourly service for multiple stops in south Houston. We also handle Galveston cruise transfers.",
        },
        {
          heading: "Why Book Jean Limo in Pearland",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Pearland to Hobby Airport?",
          a: "Usually 20–30 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Pearland for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Pearland to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
