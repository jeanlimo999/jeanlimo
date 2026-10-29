import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Texas Medical Center Car Service | Jean Limo",
  description:
    "Private car service in the Texas Medical Center for IAH and Hobby airport transfers, patient and visitor transportation, and hourly chauffeur. Flat rates and professional drivers.",
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
      intro="Jean Limo provides private chauffeur and black car service for the Texas Medical Center area. We handle airport transfers to IAH and Hobby, patient and visitor transportation, and hourly service around one of the world’s largest medical complexes. Reliable timing and professional drivers help patients, families, and visitors travel comfortably."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Medical Center Airport Transfers",
        title: "Medical Center to IAH in 30–45 Minutes",
        body: "Reliable timing for appointments and flights. Flight monitoring available for airport arrivals so your chauffeur is ready when you land.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "IAH and Hobby from the Medical Center with flight monitoring." },
        { title: "Patient & Visitor Transport", body: "Appointments, hospital visits, and family transportation." },
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
        "Professional, background-checked drivers",
        "Flat rates on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Service Around the Medical Center",
          body: "We regularly handle airport runs and transportation for medical appointments, hospital visits, and family needs. Typical drive time to IAH is 30–45 minutes depending on traffic. We also connect the Medical Center with Downtown, the Galleria, Midtown, and both airports.",
        },
        {
          heading: "Popular Routes from the Medical Center",
          body: "IAH (30–45 min), Hobby (15–25 min), Downtown Houston (10–20 min), and Galleria (15–25 min). Exact times depend on traffic. Hobby is often the closer airport for many Medical Center travelers.",
        },
        {
          heading: "For Patients and Visitors",
          body: "Private car service offers a more comfortable alternative for medical appointments or hospital visits. We provide door-to-door service with professional drivers and clean vehicles. Share appointment times or flight details for the best pickup windows.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
      ]}
      faqs={[
        {
          q: "How long is the drive from the Medical Center to IAH?",
          a: "Usually 30–45 minutes depending on traffic. We monitor flights so your chauffeur can adjust for delays or early arrivals.",
        },
        {
          q: "Do you offer transportation for medical appointments?",
          a: "Yes. We handle patient and visitor transportation around the Medical Center for appointments and hospital visits.",
        },
        {
          q: "Can I book a round trip to the airport?",
          a: "Yes. You can book both directions in one reservation for convenience.",
        },
        {
          q: "Is Hobby closer than IAH from the Medical Center?",
          a: "Often yes. Hobby is typically the shorter option for many Medical Center destinations. Drive times depend on traffic.",
        },
        {
          q: "Do you offer hourly service for multiple medical stops?",
          a: "Yes. Hourly chauffeur service is available with a 2-hour minimum for multiple stops or as-directed travel.",
        },
      ]}
    />
  );
}
