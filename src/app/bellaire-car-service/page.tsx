import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Bellaire Airport Car Service | Jean Limo",
  description:
    "Private car service in Bellaire for IAH and Hobby airport transfers, corporate travel, and events. Professional chauffeurs and flat rates.",
  alternates: {
    canonical: "https://jeanlimo.com/bellaire-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Bellaire"
      title="Bellaire Airport Car Service"
      intro="Jean Limo offers private car and chauffeur service for Bellaire. We specialize in airport transfers to IAH and Hobby, along with corporate and personal travel for residents and businesses in the area."
      points={[
        "IAH and Hobby airport transfers from Bellaire",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service available",
        "Flat rates with gratuity and fuel included on most local trips",
        "Professional chauffeurs",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Local Service",
          body: "Bellaire is conveniently located for many Houston destinations. Airport runs to IAH typically take 30–45 minutes. We also serve nearby areas including West University and the Medical Center.",
        },
      ]}
      faqs={[
        {
          q: "How long from Bellaire to IAH?",
          a: "Usually 30–45 minutes depending on traffic.",
        },
      ]}
    />
  );
}
