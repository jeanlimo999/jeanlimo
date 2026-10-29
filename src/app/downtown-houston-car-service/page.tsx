import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Downtown Houston Black Car Service | Jean Limo",
  description:
    "Downtown Houston black car service for convention visitors, corporate travel, hotel transfers, and airport runs to IAH and Hobby. Professional chauffeurs and flat rates.",
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
      intro="Jean Limo provides private black car and executive chauffeur service in Downtown Houston. We handle airport transfers, convention transportation, hotel pickups, and corporate meetings around the George R. Brown Convention Center, Toyota Center, Theater District, and the central business district. Flat rates and professional drivers make travel simple for visitors and locals."
      image="/fleet/sedan.jpg"
      highlight={{
        kicker: "Convention & Corporate Service",
        title: "Downtown to IAH in 25–40 Minutes",
        body: "Reliable transfers between Downtown hotels, offices, and both Houston airports. Flight monitoring available for arrivals so your chauffeur is ready when you land.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Private service between Downtown and IAH or Hobby with flight monitoring." },
        { title: "Convention Transportation", body: "Pickups and drop-offs at George R. Brown Convention Center." },
        { title: "Hotel Transfers", body: "Service to and from Downtown hotels for business and leisure." },
        { title: "Corporate Meetings", body: "Hourly chauffeur for multiple stops in the central business district." },
        { title: "Event Transportation", body: "Toyota Center, concerts, Theater District, and special events." },
        { title: "Sprinter for Groups", body: "One vehicle for teams attending conferences or events." },
      ]}
      points={[
        "Airport transfers to IAH and Hobby",
        "Convention and corporate travel",
        "Hotel and office pickups",
        "Sedan, SUV, and Sprinter options",
        "Hourly service for multiple meetings",
        "Professional, background-checked chauffeurs",
        "24/7 dispatch",
      ]}
      sections={[
        {
          heading: "Downtown Locations We Serve",
          body: "George R. Brown Convention Center, Toyota Center, Discovery Green, Theater District, and major hotels and office towers in the central business district. We also connect Downtown with the Galleria, Medical Center, Energy Corridor, Sugar Land, and both airports.",
        },
        {
          heading: "For Convention Visitors",
          body: "Many visitors book a private car for airport arrival, daily meetings, and departure. We coordinate timing so you are not waiting after sessions or flights. Share your convention schedule or flight details for the best pickup windows.",
        },
        {
          heading: "Popular Routes from Downtown",
          body: "IAH (25–40 min), Hobby (15–25 min), Galleria (15–25 min), Texas Medical Center (10–20 min), and Sugar Land (25–40 min). Exact times vary with traffic. Hobby is often the closer airport for many Downtown travelers.",
        },
        {
          heading: "What to Expect",
          body: "Your chauffeur arrives in a clean late-model vehicle. For airport pickups, share your flight number so we can monitor it and adjust for delays. Gratuity and fuel are included in our flat rates on most local trips.",
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
          a: "Yes. We regularly serve the convention center and nearby hotels for arrivals, departures, and daily transportation.",
        },
        {
          q: "Is hourly service available for Downtown meetings?",
          a: "Yes. Hourly chauffeur service works well for multiple stops in the central business district with a 2-hour minimum.",
        },
        {
          q: "Is Hobby closer than IAH from Downtown?",
          a: "Often yes. Hobby is typically the shorter option for many Downtown destinations. Drive times depend on traffic.",
        },
        {
          q: "Do you offer Sprinter service for convention groups?",
          a: "Yes. Sprinter vans are available for teams or groups attending conferences, events, or traveling together from the airport.",
        },
      ]}
    />
  );
}
