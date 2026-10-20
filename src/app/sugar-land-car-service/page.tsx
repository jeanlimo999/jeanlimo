import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Sugar Land Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Sugar Land for IAH, Hobby, and Galveston transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/sugar-land-car-service",
  },
  openGraph: {
    title: "Sugar Land Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Sugar Land for IAH, Hobby, and Galveston transfers, corporate travel, and hourly chauffeur. Flat rates, professional drivers.",
    url: "https://jeanlimo.com/sugar-land-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Sugar Land"
      title="Sugar Land Car Service"
      intro="Jean Limo offers private chauffeur and black car service based in the Sugar Land area. We provide reliable airport transfers to IAH and Hobby, Galveston cruise transportation, corporate travel, and hourly service for residents and businesses in Sugar Land and southwest Houston."
      points={[
        "IAH and Hobby airport transfers from Sugar Land",
        "Galveston cruise port transfers with luggage space",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings and events",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs and 24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Common Trips from Sugar Land",
          body: "Airport runs to IAH or Hobby, transfers to the Port of Galveston for cruises, corporate transportation, and point-to-point service across Greater Houston. We are familiar with the area and time pickups accordingly.",
        },
        {
          heading: "Local Convenience",
          body: "As a Sugar Land-based operator, we understand local traffic patterns and can provide dependable service for both one-way and hourly needs.",
        },
      ]}
      faqs={[
        {
          q: "Do you offer Sugar Land to Galveston cruise transfers?",
          a: "Yes. We regularly handle timed transfers to the Port of Galveston with vehicles that have space for luggage.",
        },
        {
          q: "How far is Sugar Land from IAH?",
          a: "Typically 35–50 minutes depending on traffic. Flight monitoring helps ensure your chauffeur is ready when you land.",
        },
        {
          q: "Is hourly service available in Sugar Land?",
          a: "Yes. Book hourly chauffeur service with a 2-hour minimum for multiple stops.",
        },
      ]}
    />
  );
}
