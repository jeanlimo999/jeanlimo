import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Stafford Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Stafford for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/stafford-car-service",
  },
  openGraph: {
    title: "Stafford Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Stafford for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
    url: "https://jeanlimo.com/stafford-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Stafford"
      title="Stafford Car Service"
      intro="Jean Limo provides private car and chauffeur service for Stafford residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby Airport transfers from Stafford",
        "IAH Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Stafford",
          body: "Most clients book airport runs to Hobby or IAH, corporate transportation, and hourly service for multiple stops in southwest Houston. We also handle Galveston cruise transfers.",
        },
        {
          heading: "Why Book Jean Limo in Stafford",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Stafford to Hobby Airport?",
          a: "Usually 25–35 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Stafford for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Stafford to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
