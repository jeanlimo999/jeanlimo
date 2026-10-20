import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Texas Medical Center Car Service | Jean Limo",
  description:
    "Private car service in the Texas Medical Center for IAH and Hobby airport transfers, patient and visitor transportation, and hourly chauffeur.",
  alternates: {
    canonical: "https://jeanlimo.com/medical-center-car-service",
  },
  openGraph: {
    title: "Texas Medical Center Car Service | Jean Limo",
    description:
      "Private car service in the Texas Medical Center for airport transfers and patient transportation.",
    url: "https://jeanlimo.com/medical-center-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Medical Center"
      title="Texas Medical Center Car Service"
      intro="Private car and chauffeur service for the Texas Medical Center area. Jean Limo handles airport transfers, patient and visitor transportation, and hourly service around one of the world’s largest medical complexes."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Medical Center Airport Transfers",
        title: "Medical Center to IAH in 30–45 Minutes",
        body: "Reliable timing for appointments and flights. Flight monitoring available for airport arrivals.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "IAH and Hobby from the Medical Center." },
        { title: "Patient & Visitor Transport", body: "Appointments and hospital visits." },
        { title: "Hourly Service", body: "Multiple stops for medical or business needs." },
        { title: "Sedan & SUV", body: "Comfortable private vehicles." },
        { title: "Sprinter for Groups", body: "Family or group transportation." },
        { title: "Nearby Areas", body: "Downtown, Galleria, and Midtown." },
      ]}
      points={[
        "Airport transfers to IAH and Hobby",
        "Patient and visitor transportation",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur available",
        "Professional drivers",
      ]}
      sections={[
        {
          heading: "Service Around the Medical Center",
          body: "We regularly handle airport runs and transportation for medical appointments. Typical drive time to IAH is 30–45 minutes depending on traffic. We also connect the Medical Center with Downtown, the Galleria, and both airports.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "How long from the Medical Center to IAH?", a: "Usually 30–45 minutes depending on traffic." },
        { q: "Do you offer transportation for medical appointments?", a: "Yes. We handle patient and visitor transportation around the Medical Center." },
        { q: "Can I book a round trip to the airport?", a: "Yes. Book both directions in one reservation." },
      ]}
    />
  );
}
