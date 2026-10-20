import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Missouri City Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Missouri City for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/missouri-city-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Missouri City"
      title="Missouri City Car Service"
      intro="Jean Limo provides private car and chauffeur service for Missouri City residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby Airport transfers from Missouri City",
        "IAH Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Missouri City",
          body: "Most clients book airport runs to Hobby (typically 25–35 minutes) or IAH, corporate transportation, and hourly service for multiple stops in southwest Houston. We also handle Galveston cruise transfers.",
        },
        {
          heading: "Why Book Jean Limo in Missouri City",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Missouri City to Hobby Airport?",
          a: "Usually 25–35 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Missouri City for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Missouri City to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
