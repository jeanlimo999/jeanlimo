import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Long-Distance Car Service | Austin, Dallas, San Antonio | Jean Limo",
  description:
    "Private long-distance car service from Houston to Austin, Dallas, San Antonio, and College Station. Professional chauffeur, flat rates, sedan, SUV, and Sprinter options.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-long-distance-car-service",
  },
  openGraph: {
    title: "Houston Long-Distance Car Service | Jean Limo",
    description:
      "Private transfers from Houston to Austin, Dallas, San Antonio, and College Station.",
    url: "https://jeanlimo.com/houston-long-distance-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Long-Distance"
      title="Houston Long-Distance Car Service"
      intro="Private chauffeur service from Houston to Austin, Dallas, San Antonio, College Station, and other Texas destinations. Door-to-door travel with a professional driver, no airport security lines, and flexible departure times."
      image="/fleet/suv.jpg"
      highlight={{
        kicker: "Door-to-Door Texas Travel",
        title: "Skip the Airport. Ride Direct.",
        body: "Travel on your schedule with a professional chauffeur. Ideal for business meetings, family trips, or groups who prefer private transportation over flying.",
        cta: "Get a Long-Distance Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Houston to Austin", body: "Private transfer for business or leisure. Typical drive time 2.5–3.5 hours." },
        { title: "Houston to Dallas", body: "Direct service for meetings and events. Typical drive time 3.5–4.5 hours." },
        { title: "Houston to San Antonio", body: "Comfortable private travel. Typical drive time 3–4 hours." },
        { title: "Houston to College Station", body: "Convenient for Texas A&M visits and events. Typical drive time 1.5–2 hours." },
        { title: "Vehicle Options", body: "Sedan, SUV, or Sprinter depending on group size and luggage." },
        { title: "Round Trips", body: "Book both directions in one reservation." },
      ]}
      points={[
        "Professional chauffeur included",
        "Door-to-door service",
        "Sedan, SUV, or Sprinter options",
        "Flexible departure times",
        "No airport security or baggage claim",
        "Flat-rate quotes based on distance",
      ]}
      sections={[
        {
          heading: "Popular Long-Distance Routes",
          body: "We regularly handle transfers between Houston and Austin, Dallas, San Antonio, and College Station. Drive times vary with traffic. Share your pickup and drop-off addresses for an accurate quote and recommended departure time.",
        },
        {
          heading: "Why Choose Private Long-Distance Travel",
          body: "Private car service lets you leave on your schedule, work or rest during the ride, and arrive directly at your destination. It is often more convenient than flying for groups, travelers with significant luggage, or trips where you need a vehicle at both ends.",
        },
        {
          heading: "How to Book",
          body: "Provide your pickup and drop-off addresses, date, time, and passenger count. We confirm availability and provide a flat-rate quote. Sprinters are available for larger groups. Contact us for multi-stop or return-trip itineraries.",
        },
      ]}
      relatedLinks={[
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/houston-black-car-service", label: "Black Car" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/galleria-car-service", label: "Galleria" },
      ]}
      faqs={[
        {
          q: "How long is the drive from Houston to Austin?",
          a: "Typically 2.5–3.5 hours depending on traffic and exact addresses.",
        },
        {
          q: "Can I book a Sprinter for a long-distance trip?",
          a: "Yes. Sprinters are available for groups traveling together.",
        },
        {
          q: "Do you offer round trips?",
          a: "Yes. Book both directions in one reservation.",
        },
        {
          q: "How is pricing calculated?",
          a: "Long-distance trips are quoted based on distance and vehicle type. Contact us with your addresses for a flat rate.",
        },
      ]}
    />
  );
}
