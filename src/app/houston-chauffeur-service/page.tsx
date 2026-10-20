import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Hourly Chauffeur Service | Jean Limo",
  description:
    "As-directed hourly chauffeur service in Houston. 2-hour minimum, unlimited stops, professional drivers. Sedan, SUV, and Sprinter available.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-chauffeur-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Hourly chauffeur"
      title="Houston Hourly Chauffeur Service"
      intro="As-directed hourly chauffeur service across Greater Houston. Your chauffeur stays with you for the duration of the booking, handling multiple stops for meetings, events, shopping, or a full day of travel."
      points={[
        "Business Sedan $95/hr, Business SUV $125/hr, Sprinter $195/hr",
        "2-hour minimum",
        "Unlimited stops within Greater Houston",
        "Includes 20 miles per hour (overage $2.50/mile)",
        "Professional chauffeurs and 24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Best Uses",
          body: "Corporate roadshows, multiple meetings in one day, wedding party transportation, client entertainment, shopping, or city tours.",
        },
      ]}
      faqs={[
        {
          q: "What is the minimum?",
          a: "2 hours.",
        },
        {
          q: "Can I make unlimited stops?",
          a: "Yes, within Greater Houston (subject to the included mileage).",
        },
      ]}
    />
  );
}
