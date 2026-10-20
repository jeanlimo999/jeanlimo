import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Pasadena Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Pasadena for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/pasadena-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Pasadena"
      title="Pasadena Car Service"
      intro="Jean Limo provides private car and chauffeur service for Pasadena residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby Airport transfers from Pasadena",
        "IAH Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Pasadena",
          body: "Most clients book airport runs to Hobby (typically 15–25 minutes) or IAH, corporate transportation, and hourly service for multiple stops in southeast Houston.",
        },
        {
          heading: "Why Book Jean Limo in Pasadena",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Pasadena to Hobby Airport?",
          a: "Usually 15–25 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Pasadena for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Pasadena to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
