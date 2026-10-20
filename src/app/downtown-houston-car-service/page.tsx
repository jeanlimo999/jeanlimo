import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Downtown Houston Black Car Service | Jean Limo",
  description:
    "Downtown Houston black car service for convention visitors, corporate travel, hotel transfers, and airport runs to IAH and Hobby. Professional chauffeurs.",
  alternates: {
    canonical: "https://jeanlimo.com/downtown-houston-car-service",
  },
  openGraph: {
    title: "Downtown Houston Black Car Service | Jean Limo",
    description:
      "Downtown Houston black car service for convention visitors, corporate travel, hotel transfers, and airport runs.",
    url: "https://jeanlimo.com/downtown-houston-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Downtown Houston"
      title="Downtown Houston Black Car Service"
      intro="Private black car and executive chauffeur service in Downtown Houston. Jean Limo handles airport transfers, convention transportation, hotel pickups, and corporate meetings around the George R. Brown Convention Center, Toyota Center, and central business district."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Convention & Corporate Service",
        title: "Downtown to IAH in 25–40 Minutes",
        body: "Reliable transfers between Downtown hotels, offices, and both Houston airports. Flight monitoring available for arrivals.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Private service between Downtown and IAH or Hobby." },
        { title: "Convention Transportation", body: "Pickups and drop-offs at George R. Brown Convention Center." },
        { title: "Hotel Transfers", body: "Service to and from Downtown hotels for business and leisure." },
        { title: "Corporate Meetings", body: "Hourly chauffeur for multiple stops in the central business district." },
        { title: "Event Transportation", body: "Toyota Center, concerts, and special events." },
        { title: "Sprinter for Groups", body: "One vehicle for teams attending conferences or events." },
      ]}
      points={[
        "Airport transfers to IAH and Hobby",
        "Convention and corporate travel",
        "Hotel and office pickups",
        "Sedan, SUV, and Sprinter options",
        "Hourly service for multiple meetings",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Downtown Locations We Serve",
          body: "George R. Brown Convention Center, Toyota Center, Discovery Green, Theater District, and major hotels and office towers. We also connect Downtown with the Galleria, Medical Center, Energy Corridor, and both airports.",
        },
        {
          heading: "For Convention Visitors",
          body: "Many visitors book a private car for airport arrival, daily meetings, and departure. We coordinate timing so you are not waiting after sessions or flights.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/medical-center-car-service", label: "Medical Center" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/houston-black-car-service", label: "Black Car" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        {
          q: "Do you offer Downtown to IAH car service?",
          a: "Yes. This is a common route. Typical drive time is 25–40 minutes depending on traffic. Flight monitoring is available.",
        },
        {
          q: "Can you pick up from the George R. Brown Convention Center?",
          a: "Yes. We regularly serve the convention center and nearby hotels.",
        },
        {
          q: "Is hourly service available for Downtown meetings?",
          a: "Yes. Hourly chauffeur service works well for multiple stops in the central business district.",
        },
      ]}
    />
  );
}
