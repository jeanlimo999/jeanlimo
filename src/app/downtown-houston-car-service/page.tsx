import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Downtown Houston Executive Car Service | Jean Limo",
  description:
    "Private executive car and chauffeur service in Downtown Houston for airport transfers, corporate travel, and events. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/downtown-houston-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Downtown Houston"
      title="Downtown Houston Executive Car Service"
      intro="Jean Limo provides private car and executive chauffeur service in Downtown Houston. We handle airport transfers to IAH and Hobby, corporate roadshows, hotel transfers, and special events with professional drivers and clear pricing."
      points={[
        "Airport transfers to IAH and Hobby from Downtown",
        "Executive and corporate transportation",
        "Hotel and office pickups",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for multiple meetings",
        "Flat rates with gratuity and fuel included on most local trips",
      ]}
      sections={[
        {
          heading: "Downtown Service",
          body: "Downtown is a major business hub. We frequently serve office buildings, hotels, and the convention area. IAH transfers typically take 25–40 minutes depending on traffic."
        },
      ]}
      faqs={[
        {
          q: "Do you offer Downtown to IAH car service?",
          a: "Yes. This is one of our more common routes. Flight monitoring is available.",
        },
        {
          q: "Can I book hourly service for meetings in Downtown?",
          a: "Yes. Hourly service works well for multiple stops in the central business district.",
        },
      ]}
    />
  );
}
