import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Spring Branch Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Spring Branch for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/spring-branch-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Spring Branch"
      title="Spring Branch Car Service"
      intro="Jean Limo provides private car and chauffeur service for Spring Branch residents and businesses. We handle frequent IAH and Hobby airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable IAH and Hobby airport transfers from Spring Branch",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Spring Branch",
          body: "Most clients book airport runs, corporate transportation, and hourly service for multiple stops in west Houston. We also handle longer-distance trips.",
        },
        {
          heading: "Why Book Jean Limo in Spring Branch",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Spring Branch to IAH?",
          a: "Usually 30–45 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Spring Branch for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Spring Branch to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
