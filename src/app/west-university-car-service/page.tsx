import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "West University Luxury Car Service | Jean Limo",
  description:
    "Private chauffeur and car service in West University for airport transfers, events, and corporate travel. Professional drivers and transparent pricing.",
  alternates: {
    canonical: "https://jeanlimo.com/west-university-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="West University"
      title="West University Luxury Car Service"
      intro="Jean Limo offers private car and chauffeur service for West University residents and visitors. We provide airport transfers, event transportation, and corporate service with a focus on reliability and professionalism in this established neighborhood."
      points={[
        "IAH and Hobby airport transfers from West University",
        "Suitable for residential and event needs",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service available",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional, background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Local Details",
          body: "West University is a compact, established residential area. Airport runs to IAH typically take 30–45 minutes. We also handle trips to nearby Medical Center, Downtown, and the Galleria.",
        },
      ]}
      faqs={[
        {
          q: "How long from West University to IAH?",
          a: "Usually 30–45 minutes depending on traffic.",
        },
        {
          q: "Do you serve West University for special events?",
          a: "Yes. Clients often book for dinners, parties, and private events.",
        },
      ]}
    />
  );
}
