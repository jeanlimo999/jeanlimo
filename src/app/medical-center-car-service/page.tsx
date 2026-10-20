import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Medical Center Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in the Texas Medical Center for IAH and Hobby airport transfers, patient and visitor transport, and hourly chauffeur. Flat rates, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/medical-center-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Medical Center"
      title="Medical Center Car Service"
      intro="Jean Limo provides private car and chauffeur service for the Texas Medical Center area. We handle frequent IAH and Hobby airport transfers, patient and visitor transportation, corporate travel, and hourly service with professional chauffeurs and transparent flat rates."
      points={[
        "Reliable IAH and Hobby airport transfers from the Medical Center",
        "Patient and visitor transportation",
        "Business sedan, SUV, and Sprinter options",
        "Hourly chauffeur service for meetings or appointments",
        "Flat rates with gratuity and fuel included on most local trips",
        "24/7 dispatch and background-checked chauffeurs",
      ]}
      sections={[
        {
          heading: "Popular Services from the Medical Center",
          body: "Most clients book airport runs, transportation for medical appointments, and hourly service for multiple stops around the Texas Medical Center and surrounding areas.",
        },
        {
          heading: "Why Book Jean Limo in the Medical Center",
          body: "Clear pricing before you book, flight monitoring for airport trips, and a professional team experienced with the Medical Center area. Get an instant quote online or call dispatch.",
        },
      ]}
      faqs={[
        {
          q: "How long does it take from the Medical Center to IAH?",
          a: "Usually 30–45 minutes depending on time of day and traffic. We monitor flights so your chauffeur arrives at the right time.",
        },
        {
          q: "Do you serve the Medical Center for hourly chauffeur service?",
          a: "Yes. Hourly service is available with a 2-hour minimum and unlimited stops within Greater Houston.",
        },
        {
          q: "Can I book a round trip from the Medical Center to the airport?",
          a: "Yes. Book both directions in one reservation.",
        },
      ]}
    />
  );
}
