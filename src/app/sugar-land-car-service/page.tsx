import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Sugar Land Car Service & Airport Transportation | Jean Limo",
  description:
    "Sugar Land car service for IAH and Hobby airport transfers, Galveston cruises, and local chauffeur. Jean Limo is based in Sugar Land. Book private transportation.",
  alternates: {
    canonical: "https://jeanlimo.com/sugar-land-car-service",
  },
  openGraph: {
    title: "Sugar Land Car Service & Airport Transportation | Jean Limo",
    description:
      "Sugar Land car service for IAH and Hobby airport transfers, Galveston cruises, and local chauffeur. Jean Limo is based in Sugar Land.",
    url: "https://jeanlimo.com/sugar-land-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Sugar Land"
      title="Sugar Land Car Service & Airport Transportation"
      intro="Jean Limo is based in Sugar Land and provides private car service for residents and businesses across southwest Houston. From IAH and Hobby airport transfers to Galveston cruise port runs and hourly chauffeur service, we know local traffic patterns in First Colony, Telfair, New Territory, and surrounding neighborhoods."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Local Airport & Group Service",
        title: "Sugar Land to IAH in 50–60 Minutes",
        body: "Most trips from Sugar Land to George Bush Intercontinental Airport take 50–60 minutes depending on traffic. We monitor flights and time pickups so your chauffeur is ready when you land.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Sugar Land to IAH", body: "Private transfers with flight monitoring. Typical drive time 50–60 minutes." },
        { title: "Sugar Land to Hobby", body: "Door-to-door service to William P. Hobby Airport." },
        { title: "Galveston Cruise Transfers", body: "Timed transfers to the Port of Galveston with luggage space." },
        { title: "Local & Hourly Service", body: "Chauffeur for meetings, shopping, and multiple stops in Sugar Land." },
        { title: "Corporate Transportation", body: "Reliable service for local businesses and executive travel." },
        { title: "Sprinter for Groups", body: "One vehicle for families or teams heading to the airport or events." },
      ]}
      points={[
        "Based in Sugar Land — we know local roads and traffic",
        "Airport transfers to IAH and Hobby",
        "Galveston cruise port service",
        "Sedan, SUV, and Sprinter options",
        "Flat rates on most local trips",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Neighborhoods We Serve in Sugar Land",
          body: "First Colony, Telfair, New Territory, Sugar Land Town Square, Greatwood, and nearby communities. We also serve Missouri City, Stafford, Richmond, and Fulshear for airport and point-to-point trips.",
        },
        {
          heading: "Why Book a Local Operator",
          body: "As a Sugar Land-based company, we understand peak traffic on the Southwest Freeway and Beltway 8. Pickup times are set with realistic buffers so you arrive for flights or events without unnecessary waiting.",
        },
      ]}
      relatedLinks={[
        { href: "/sugar-land-to-iah", label: "Sugar Land to IAH" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-to-galveston", label: "Galveston Cruise" },
        { href: "/missouri-city-car-service", label: "Missouri City" },
        { href: "/stafford-car-service", label: "Stafford" },
        { href: "/richmond-car-service", label: "Richmond" },
        { href: "/fulshear-car-service", label: "Fulshear" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        {
          q: "How long is the drive from Sugar Land to IAH?",
          a: "Typically 50–60 minutes depending on traffic. We monitor flights and adjust pickup times accordingly.",
        },
        {
          q: "Do you offer Sugar Land to Galveston cruise transfers?",
          a: "Yes. We regularly handle timed transfers to the Port of Galveston with vehicles that have space for luggage.",
        },
        {
          q: "Is hourly service available in Sugar Land?",
          a: "Yes. Book hourly chauffeur service with a 2-hour minimum for multiple stops.",
        },
        {
          q: "Can I book a Sprinter from Sugar Land?",
          a: "Yes. Sprinter vans are available for group airport transfers and events.",
        },
      ]}
    />
  );
}
