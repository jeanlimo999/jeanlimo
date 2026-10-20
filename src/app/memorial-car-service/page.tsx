import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Memorial Houston Car Service | Jean Limo",
  description:
    "Private car service in Memorial and Memorial Villages for airport transfers, corporate travel, and hourly chauffeur. Professional drivers and flat rates.",
  alternates: {
    canonical: "https://jeanlimo.com/memorial-car-service",
  },
  openGraph: {
    title: "Memorial Houston Car Service | Jean Limo",
    description:
      "Private car service in Memorial and Memorial Villages for airport transfers, corporate travel, and hourly chauffeur. Professional drivers and flat rates.",
    url: "https://jeanlimo.com/memorial-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Memorial"
      title="Memorial Houston Car Service"
      intro="Jean Limo offers private chauffeur service for Memorial and the Memorial Villages area. We provide reliable airport transportation to IAH and Hobby, corporate travel, and as-directed hourly service for residents and businesses in this established Houston neighborhood."
      points={[
        "IAH and Hobby airport transfers from Memorial",
        "Corporate and executive transportation",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service available",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs familiar with the area",
      ]}
      sections={[
        {
          heading: "Common Routes",
          body: "Airport runs are frequent requests. Memorial to IAH typically takes 35–50 minutes depending on traffic and time of day. We also handle trips to the Galleria, Downtown, and Energy Corridor.",
        },
      ]}
      faqs={[
        {
          q: "How long from Memorial to IAH?",
          a: "Usually 35–50 minutes depending on traffic. Flight monitoring helps with arrivals.",
        },
        {
          q: "Do you serve Memorial Villages?",
          a: "Yes. We cover Memorial and the surrounding villages area.",
        },
      ]}
    />
  );
}
