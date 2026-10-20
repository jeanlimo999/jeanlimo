import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Galleria Car Service & Sprinter Van | Jean Limo",
  description:
    "Luxury Galleria car service, Houston airport transfers, Mercedes-Benz Sprinter vans and large group transportation. Get a private chauffeur quote.",
  alternates: {
    canonical: "https://jeanlimo.com/galleria-car-service",
  },
  openGraph: {
    title: "Galleria Car Service & Sprinter Van | Jean Limo",
    description:
      "Luxury Galleria car service, Houston airport transfers, Mercedes-Benz Sprinter vans and large group transportation. Get a private chauffeur quote.",
    url: "https://jeanlimo.com/galleria-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Galleria / Uptown"
      title="Houston Galleria Car Service & Sprinter Van Transportation"
      intro="Luxury Black Car Service • Airport Transfers • Group Transportation. Experience premium chauffeur service in Houston’s Galleria and Uptown district with Jean Limo. From private airport transfers and executive travel to weddings, corporate events, and large group transportation, we provide professional chauffeurs and comfortable luxury vehicles for every occasion."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Luxury Group Transportation",
        title: "Big Group? Ride Together in Style.",
        body: "Skip multiple cars and keep your group together in a Mercedes-Benz Sprinter. Ideal for corporate teams, airport groups with luggage, weddings, and events.",
        cta: "Get a Sprinter Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Private transfers between the Galleria and IAH or Hobby. Typical IAH runs take 25–40 minutes." },
        { title: "Luxury Black Car Service", body: "Premium sedans and SUVs for executives, hotel guests, and business travelers." },
        { title: "Mercedes-Benz Sprinter Van Service", body: "Spacious Sprinter for families, corporate teams, and larger groups." },
        { title: "Large Group Transportation", body: "One vehicle for conferences, weddings, concerts, and sporting events." },
        { title: "Corporate & Executive Transportation", body: "Dependable chauffeur service for meetings, airport runs, and VIP guests." },
        { title: "Hourly Chauffeur Service", body: "Flexible hourly service for shopping, dining, meetings, and multiple stops." },
      ]}
      points={[
        "Private airport transfers to IAH and Hobby Airport",
        "Luxury black car service with professional chauffeurs",
        "Mercedes-Benz Sprinter vans for group travel",
        "Corporate transportation and executive travel",
        "Weddings, concerts, sporting events, and private celebrations",
        "Flexible hourly chauffeur service",
        "Convenient Galleria hotel, business, and residential pickups",
      ]}
      sections={[
        {
          heading: "Galleria to IAH & Hobby Airport Transfers",
          body: "Most Galleria to IAH transfers take 25–40 minutes depending on traffic via Beltway 8 or the Hardy Toll Road. Hobby is typically 20–30 minutes. We monitor flights when you share the number and time pickups with appropriate buffer for departures. Common pickup points include The Post Oak Hotel, The Westin Galleria, Hyatt Regency Houston/Galleria, and nearby offices and residences.",
        },
        {
          heading: "Galleria & Uptown Locations We Serve",
          body: "The Galleria Shopping Center, The Post Oak Hotel at Uptown Houston, The Westin Galleria Houston, Hyatt Regency Houston/Galleria, Uptown Park, Post Oak Boulevard, River Oaks, and Tanglewood. We also connect the Galleria with Downtown Houston, Memorial, Sugar Land, the Energy Corridor, IAH, Hobby, and the Port of Galveston.",
        },
        {
          heading: "Why Travelers Choose Jean Limo",
          body: "Professional chauffeurs, clean luxury vehicles, and clear flat-rate pricing. Whether you need an executive sedan for a meeting or a Sprinter for a group heading to NRG Stadium or Toyota Center, we handle the logistics so you can focus on the trip.",
        },
      ]}
      relatedLinks={[
        { href: "/houston-sprinter-van-service", label: "Sprinter Van Service" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-black-car-service", label: "Black Car" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/river-oaks-car-service", label: "River Oaks" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/tanglewood-car-service", label: "Tanglewood" },
        { href: "/sugar-land-car-service", label: "Sugar Land" },
      ]}
      faqs={[
        {
          q: "Do you offer Mercedes-Benz Sprinter transportation for large groups?",
          a: "Yes. Jean Limo provides Sprinter van service for corporate groups, airport transfers, weddings, private events, and special occasions. Passenger and luggage capacity depend on vehicle configuration.",
        },
        {
          q: "Can you pick up passengers from Galleria hotels?",
          a: "Yes. We offer private transportation from Galleria-area hotels, residences, offices, shopping centers, and event venues.",
        },
        {
          q: "How long is the drive from the Galleria to IAH?",
          a: "Typically 25–40 minutes depending on traffic. We monitor flights and time pickups accordingly.",
        },
        {
          q: "Can I book a chauffeur for multiple stops?",
          a: "Absolutely. Our hourly chauffeur service is ideal for shopping, dining, meetings, sightseeing, and customized itineraries.",
        },
        {
          q: "How much does Galleria Sprinter transportation cost?",
          a: "Pricing depends on passenger count, pickup location, destination, trip duration, and vehicle requirements. Contact Jean Limo for a personalized quote.",
        },
        {
          q: "Do you provide transportation for concerts and sporting events?",
          a: "Yes. Jean Limo offers private transportation to Houston concerts, sporting events, and entertainment venues, including events at NRG Stadium and Toyota Center.",
        },
      ]}
    />
  );
}
