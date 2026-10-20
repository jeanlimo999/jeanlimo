import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "River Oaks Car Service | Private Chauffeur | Jean Limo",
  description:
    "Private car and chauffeur service in River Oaks for airport transfers, corporate travel, and special events. Flat rates, professional drivers in Houston's luxury neighborhood.",
  alternates: {
    canonical: "https://jeanlimo.com/river-oaks-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="River Oaks"
      title="River Oaks Car Service"
      intro="Jean Limo provides discreet private car and chauffeur service for River Oaks residents and visitors. We handle IAH and Hobby airport transfers, corporate travel, and special occasions with professional chauffeurs and transparent pricing."
      points={[
        "Airport transfers to IAH and Hobby from River Oaks",
        "Discreet service for a luxury residential area",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for multiple stops",
        "Flat rates with gratuity and fuel included on most local trips",
        "Background-checked chauffeurs and 24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Local Service Notes",
          body: "River Oaks is a premium residential market. We focus on punctual, low-profile service for airport runs, dinners, events, and client transportation. Typical IAH transfers take 30–45 minutes depending on traffic.",
        },
      ]}
      faqs={[
        {
          q: "Do you offer River Oaks to IAH car service?",
          a: "Yes. We regularly handle airport transfers from River Oaks with flight monitoring available.",
        },
        {
          q: "Is the service suitable for special events?",
          a: "Yes. Many clients book for evenings out, galas, or private events in the area.",
        },
      ]}
    />
  );
}
