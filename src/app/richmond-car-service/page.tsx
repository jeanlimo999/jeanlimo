import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Richmond Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Richmond for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/richmond-car-service",
  },
  openGraph: {
    title: "Richmond Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Richmond for Hobby and IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
    url: "https://jeanlimo.com/richmond-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Richmond"
      title="Richmond Car Service"
      intro="Jean Limo provides private car and chauffeur service for Richmond residents and businesses. We handle frequent Hobby and IAH airport transfers, corporate travel, hourly as-directed service, and special events with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable Hobby Airport transfers from Richmond",
        "IAH Airport service available",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or events",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from Richmond",
          body: "Most clients book airport runs to Hobby or IAH, corporate transportation, and hourly service for multiple stops in southwest Houston. We also handle Galveston cruise transfers.",
        },
        {
          heading: "Why Book Jean Limo in Richmond",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team that knows the area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from Richmond to Hobby Airport?",
          a: "Usually 30–45 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve Richmond for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from Richmond to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
