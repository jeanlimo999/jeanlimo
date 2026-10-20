import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Baytown Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Baytown for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/baytown-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Baytown"
      title="Baytown Car Service"
      intro="Jean Limo provides private car and chauffeur service for Baytown residents and businesses. We handle frequent IAH and Hobby airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable IAH airport transfers from Baytown",
        "Hobby Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Baytown",
          body: "Most clients book airport runs to IAH (typically 30–45 minutes depending on traffic) or Hobby, corporate transportation, and hourly service for multiple stops in east Houston.",
        },
        {
          heading: "Why Book Jean Limo in Baytown",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Baytown to IAH?",
          a: "Usually 30–45 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Baytown for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Baytown to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
