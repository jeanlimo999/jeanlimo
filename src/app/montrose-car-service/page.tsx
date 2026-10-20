import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Montrose Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Montrose for IAH and Hobby airport transfers, nightlife, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/montrose-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Montrose"
      title="Montrose Car Service"
      intro="Jean Limo provides private car and chauffeur service for Montrose residents and visitors. We handle frequent IAH and Hobby airport transfers, nightlife transportation, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable IAH and Hobby airport transfers from Montrose",
        "Nightlife and restaurant transportation",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Montrose",
          body: "Most clients book airport runs, evening transportation around Montrose and Midtown, and hourly service for multiple stops. We also handle longer-distance trips and Galveston transfers.",
        },
        {
          heading: "Why Book Jean Limo in Montrose",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows central Houston. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Montrose to IAH?",
          a: "Usually 30–45 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Montrose for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Montrose to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
