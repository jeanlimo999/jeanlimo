import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Energy Corridor Corporate Transportation | Jean Limo",
  description:
    "Private car and chauffeur service in the Energy Corridor for corporate travel, airport transfers to IAH and Hobby, and executive transportation. Flat rates and professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/energy-corridor-car-service",
  },
  openGraph: {
    title: "Energy Corridor Corporate Transportation | Jean Limo",
    description:
      "Private car service in the Energy Corridor for corporate travel and airport transfers. Serving west Houston businesses.",
    url: "https://jeanlimo.com/energy-corridor-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Energy Corridor"
      title="Energy Corridor Corporate Transportation"
      intro="Jean Limo provides private chauffeur and black car service focused on the Energy Corridor in west Houston. We handle corporate transportation, airport transfers to IAH and Hobby, and executive travel for businesses and professionals along the corridor. Flat rates, professional drivers, and reliable timing make business travel simple."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Corporate Focus",
        title: "Airport Runs and Multi-Stop Itineraries",
        body: "Frequent requests include Energy Corridor to IAH (typically 35–50 minutes) and hourly service for meetings across the area. We monitor flights and time pickups with realistic buffers.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Corporate Transportation", body: "Executive and business travel in the corridor." },
        { title: "IAH & Hobby", body: "Airport transfers for business travelers with flight monitoring." },
        { title: "Hourly Service", body: "Multiple stops for meetings and roadshows." },
        { title: "Sedan & SUV", body: "Professional vehicles for individuals and small teams." },
        { title: "Sprinter for Groups", body: "One vehicle for larger corporate groups." },
        { title: "Nearby Coverage", body: "Katy, Memorial, and west Houston." },
      ]}
      points={[
        "Corporate and executive transportation",
        "IAH and Hobby airport transfers",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur for meetings",
        "Professional, background-checked drivers",
        "Flat rates on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Why the Energy Corridor",
          body: "The Energy Corridor has a high concentration of offices and business travelers. We regularly handle airport runs and multi-stop corporate itineraries. IAH transfers typically take 35–50 minutes depending on traffic on I-10 and surrounding roads.",
        },
        {
          heading: "Popular Routes from the Energy Corridor",
          body: "IAH (35–50 min), Hobby (30–45 min), Downtown Houston (20–35 min), Galleria (15–25 min), and Katy. Exact times depend on traffic and time of day. Share your flight details for the most accurate pickup timing.",
        },
        {
          heading: "Corporate and Hourly Service",
          body: "Hourly chauffeur service works well for multi-stop meetings, client visits, or roadshows along the corridor and into Memorial or the Galleria. We provide clean late-model vehicles and professional drivers.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/katy-car-service", label: "Katy" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
      ]}
      faqs={[
        {
          q: "Do you offer Energy Corridor to IAH service?",
          a: "Yes. This is a frequent request for corporate travelers. Typical time is 35–50 minutes depending on traffic. Flight monitoring is available.",
        },
        {
          q: "Is hourly service available for meetings?",
          a: "Yes. Hourly chauffeur service works well for multiple stops with a 2-hour minimum.",
        },
        {
          q: "Can you pick up from Energy Corridor offices?",
          a: "Yes. We regularly serve office buildings and hotels along the Energy Corridor for airport runs and business travel.",
        },
        {
          q: "Do you offer Sprinter service for corporate groups?",
          a: "Yes. Sprinter vans are available for larger teams traveling together to the airport or events.",
        },
      ]}
    />
  );
}
