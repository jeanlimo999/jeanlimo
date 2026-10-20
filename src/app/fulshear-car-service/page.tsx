import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Fulshear Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Fulshear for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/fulshear-car-service",
  },
  openGraph: {
    title: "Fulshear Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Fulshear for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
    url: "https://jeanlimo.com/fulshear-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Fulshear"
      title="Fulshear Car Service"
      intro="Jean Limo provides private car and chauffeur service for Fulshear residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby and IAH airport transfers from Fulshear",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Fulshear",
          body: "Most clients book airport runs to Hobby or IAH, corporate transportation, and hourly service for multiple stops in west Houston. We also handle longer-distance trips.",
        },
        {
          heading: "Why Book Jean Limo in Fulshear",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Fulshear to IAH?",
          a: "Usually 40–55 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Fulshear for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Fulshear to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
