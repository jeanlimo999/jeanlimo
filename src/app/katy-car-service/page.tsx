import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in Katy for IAH and Hobby airport transfers, corporate travel, and hourly chauffeur across west Houston. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/katy-car-service",
  },
  openGraph: {
    title: "Katy Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in Katy for airport transfers and corporate travel. Serving Katy, Energy Corridor, and west Houston.",
    url: "https://jeanlimo.com/katy-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Katy"
      title="Katy Car Service & Airport Transportation"
      intro="Jean Limo provides private chauffeur and black car service for Katy residents, visitors, and businesses in west Houston. From frequent IAH and Hobby airport transfers to corporate travel and hourly service, we cover the area with flat rates and professional drivers. We regularly serve Katy, the Energy Corridor, Cypress, and Fulshear."
      image="/katy.png"
      highlight={{
        kicker: "West Houston Airport Runs",
        title: "Katy to IAH Typically 40–55 Minutes",
        body: "We monitor flights and time pickups with buffer for traffic on the Katy Freeway (I-10) and surrounding roads so your chauffeur is ready when you land.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "IAH & Hobby", body: "Airport transfers from Katy and west Houston with flight monitoring." },
        { title: "Corporate Travel", body: "Business transportation for local companies and Energy Corridor offices." },
        { title: "Hourly Chauffeur", body: "As-directed service for multiple stops across Katy and west Houston." },
        { title: "Galveston Transfers", body: "Timed cruise port service with luggage space." },
        { title: "Sedan, SUV, Sprinter", body: "Vehicle options for individuals, families, and groups." },
        { title: "Nearby Areas", body: "Energy Corridor, Cypress, Fulshear, and surrounding communities." },
      ]}
      points={[
        "Airport transfers to IAH and Hobby",
        "Corporate and hourly service",
        "Sedan, SUV, and Sprinter options",
        "Galveston cruise transfers",
        "Professional, background-checked chauffeurs",
        "Flat rates on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Neighborhoods We Serve in Katy",
          body: "We regularly serve Katy, Cinco Ranch, Grand Lakes, Cross Creek Ranch, and nearby communities. We also cover the Energy Corridor, Cypress, Fulshear, and west Houston for airport and point-to-point trips.",
        },
        {
          heading: "Why Choose Local Service for Katy",
          body: "Traffic on I-10 (Katy Freeway) and the Grand Parkway can vary significantly. As a Greater Houston operator, we build realistic buffers into airport pickups and know the common routes. Flight monitoring helps us adjust for delays so you are not left waiting.",
        },
        {
          heading: "Popular Routes from Katy",
          body: "IAH (40–55 min), Hobby (35–50 min), Downtown Houston (25–40 min), Galleria (20–35 min), and Port of Galveston. Exact times depend on traffic and time of day. Share your flight details for the most accurate pickup timing.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/cypress-car-service", label: "Cypress" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
      ]}
      faqs={[
        {
          q: "How long is the drive from Katy to IAH?",
          a: "Usually 40–55 minutes depending on traffic. We monitor flights so your chauffeur can adjust for delays or early arrivals.",
        },
        {
          q: "Do you offer hourly service in Katy?",
          a: "Yes. Hourly chauffeur service is available with a 2-hour minimum for multiple stops or as-directed travel.",
        },
        {
          q: "Can I book from Katy to the Galleria or Downtown?",
          a: "Yes. We handle point-to-point trips throughout Greater Houston, including the Galleria, Downtown, and Energy Corridor.",
        },
        {
          q: "Do you serve areas near Katy?",
          a: "Yes. We regularly serve the Energy Corridor, Cypress, Fulshear, and surrounding west Houston communities.",
        },
        {
          q: "Is Sprinter service available from Katy?",
          a: "Yes. Mercedes-Benz Sprinter vans are available for group airport transfers and events.",
        },
      ]}
    />
  );
}
