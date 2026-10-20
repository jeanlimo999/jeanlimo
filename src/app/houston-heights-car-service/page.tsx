import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Heights Car Service | Jean Limo",
  description:
    "Private car and chauffeur service in the Houston Heights for airport transfers, events, and local travel. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-heights-car-service",
  },
  openGraph: {
    title: "Houston Heights Car Service | Jean Limo",
    description:
      "Private car and chauffeur service in the Houston Heights for airport transfers, events, and local travel. Flat rates and professional drivers.",
    url: "https://jeanlimo.com/houston-heights-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Houston Heights"
      title="Houston Heights Car Service"
      intro="Jean Limo provides private car and chauffeur service for the Houston Heights. We handle airport transfers, event transportation, and local trips with professional chauffeurs and transparent pricing."
      points={[
        "IAH and Hobby airport transfers from the Heights",
        "Suitable for residential and event needs",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service available",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Heights Service",
          body: "The Heights is a popular residential and dining area. Airport runs are common. IAH transfers typically take 25–40 minutes depending on traffic. We also handle trips to Downtown and the Galleria.",
        },
      ]}
      faqs={[
        {
          q: "Do you serve the Houston Heights for airport pickups?",
          a: "Yes. We regularly handle both IAH and Hobby transfers from the area.",
        },
      ]}
    />
  );
}
