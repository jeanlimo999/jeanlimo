import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "The Woodlands Car Service | Airport & Chauffeur | Jean Limo",
  description:
    "Private car service in The Woodlands for IAH airport transfers, corporate travel, and hourly chauffeur. Flat rates and professional drivers. Serving The Woodlands, Spring, and north Houston.",
  alternates: {
    canonical: "https://jeanlimo.com/the-woodlands-car-service",
  },
  openGraph: {
    title: "The Woodlands Car Service | Airport & Chauffeur | Jean Limo",
    description:
      "Private car service in The Woodlands for IAH airport transfers and corporate travel. Flat rates, flight monitoring, and professional chauffeurs.",
    url: "https://jeanlimo.com/the-woodlands-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="The Woodlands"
      title="The Woodlands Car Service & Airport Transportation"
      intro="Jean Limo provides private chauffeur and black car service for The Woodlands residents, visitors, and businesses. From frequent IAH airport transfers to corporate travel and hourly service, we cover north Houston with flat rates and professional drivers. Whether you live in The Woodlands, Creekside, or nearby communities, we handle airport runs, meetings, and special events."
      image="/woodlands.jpg"
      highlight={{
        kicker: "North Houston Airport Service",
        title: "The Woodlands to IAH in 25–35 Minutes",
        body: "Most trips from The Woodlands to George Bush Intercontinental Airport take 25–35 minutes depending on traffic. We monitor flights and time pickups so your chauffeur is ready when you land.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "IAH Airport Transfers", body: "Frequent route from The Woodlands. Flight monitoring and meet & greet available." },
        { title: "Hobby Airport", body: "Door-to-door private transfers to William P. Hobby Airport." },
        { title: "Corporate Travel", body: "Reliable transportation for local businesses and executive meetings." },
        { title: "Hourly Chauffeur", body: "As-directed service for multiple stops across north Houston." },
        { title: "Sedan, SUV, Sprinter", body: "Vehicle options for individuals, families, and groups." },
        { title: "Galveston Transfers", body: "Timed cruise port service with luggage space." },
      ]}
      points={[
        "IAH transfers typically 25–35 minutes",
        "Hobby Airport service available",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur with 2-hour minimum",
        "Professional, background-checked drivers",
        "Flat rates on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Neighborhoods We Serve in The Woodlands",
          body: "We regularly serve The Woodlands Town Center, Creekside Park, Sterling Ridge, Grogan's Mill, Panther Creek, Indian Springs, and nearby communities. We also cover Spring, Tomball, Conroe, Humble, and Kingwood for airport and point-to-point trips.",
        },
        {
          heading: "Why Choose Local Service for The Woodlands",
          body: "Traffic on I-45 and the Hardy Toll Road can vary. As a Greater Houston operator, we build realistic buffers into airport pickups and know the common routes. Flight monitoring helps us adjust for delays so you are not left waiting at the curb.",
        },
        {
          heading: "Popular Routes from The Woodlands",
          body: "IAH (25–35 min), Downtown Houston (35–50 min), Galleria (40–55 min), Sugar Land (50–70 min), and Port of Galveston. Exact times depend on traffic and time of day. Share your flight details for the most accurate pickup timing.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/spring-car-service", label: "Spring" },
        { href: "/tomball-car-service", label: "Tomball" },
        { href: "/conroe-car-service", label: "Conroe" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
      ]}
      faqs={[
        {
          q: "How long is the drive from The Woodlands to IAH?",
          a: "Usually 25–35 minutes depending on traffic. We monitor flights so your chauffeur can adjust for delays or early arrivals.",
        },
        {
          q: "Do you offer hourly service in The Woodlands?",
          a: "Yes. Hourly chauffeur service is available with a 2-hour minimum for multiple stops or as-directed travel.",
        },
        {
          q: "Can I book a round trip to the airport?",
          a: "Yes. You can book both directions in one reservation for convenience.",
        },
        {
          q: "Do you serve areas near The Woodlands?",
          a: "Yes. We regularly serve Spring, Tomball, Conroe, Humble, and Kingwood in addition to The Woodlands.",
        },
        {
          q: "Is Sprinter service available from The Woodlands?",
          a: "Yes. Mercedes-Benz Sprinter vans are available for group airport transfers and events.",
        },
      ]}
    />
  );
}
