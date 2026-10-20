import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Galleria Car Service & Sprinter Van | Jean Limo",
  description:
    "Luxury Galleria car service in Houston. Book private airport transfers, executive transportation, Mercedes Sprinter vans and group travel with Jean Limo.",
  alternates: {
    canonical: "https://jeanlimo.com/galleria-car-service",
  },
  openGraph: {
    title: "Galleria Car Service & Sprinter Van | Jean Limo",
    description:
      "Luxury Galleria car service in Houston. Book private airport transfers, executive transportation, Mercedes Sprinter vans and group travel with Jean Limo.",
    url: "https://jeanlimo.com/galleria-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Galleria / Uptown"
      title="Houston Galleria Car Service & Sprinter Van Transportation"
      intro="Experience luxury car service and Mercedes-Benz Sprinter transportation in Houston’s Galleria and Uptown district. From private airport transfers and executive travel to weddings, corporate events, and large group transportation, Jean Limo provides professional chauffeurs and comfortable vehicles for every occasion."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Luxury Group Transportation",
        title: "Big Group? Ride Together in Style.",
        body: "Mercedes-Benz Sprinter transportation for corporate teams, airport groups, weddings, concerts, and special events throughout Houston.",
        cta: "Get a Sprinter Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Private transfers to IAH and Hobby." },
        { title: "Luxury Black Car Service", body: "Executive sedans and SUVs." },
        { title: "Sprinter Van Service", body: "Comfortable group transportation." },
        { title: "Group Transportation", body: "Conferences, weddings, and events." },
        { title: "Corporate Transportation", body: "Meetings and executive travel." },
        { title: "Hourly Chauffeur Service", body: "Shopping, dining, and multiple stops." },
      ]}
      points={[
        "Luxury Sedans • SUVs • Mercedes-Benz Sprinter Vans",
        "Professional chauffeurs and transparent pricing",
        "Pickups from Galleria hotels, offices, and residences",
      ]}
      sections={[
        {
          heading: "Mercedes Sprinter Van & Large Group Transportation",
          body: "Planning a group trip? Our Mercedes-Benz Sprinter is ideal for larger parties who want to travel together without booking multiple cars. Perfect for corporate teams, airport transfers with luggage, wedding parties, family outings, conventions, concerts, and special occasions.",
        },
        {
          heading: "Why Choose Jean Limo in the Galleria",
          body: "Professional chauffeurs, clean luxury vehicles, and flexible pickup arrangements throughout the Galleria and Uptown district. Whether you are staying at a luxury hotel, attending a meeting, shopping at The Galleria, or arranging group transportation, we make the trip straightforward.",
        },
        {
          heading: "Galleria & Uptown Locations We Serve",
          body: "The Galleria Shopping Center, The Post Oak Hotel, The Westin Galleria, Hyatt Regency Houston/Galleria, Uptown Park, Post Oak Boulevard, River Oaks, and Tanglewood. We also connect the Galleria with Downtown Houston, Memorial, the Energy Corridor, Sugar Land, IAH, and Hobby.",
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
          q: "Do you offer Sprinter van transportation for large groups?",
          a: "Yes. Jean Limo offers Mercedes-Benz Sprinter transportation for group airport transfers, corporate outings, weddings, and special events. Passenger and luggage capacity depend on the vehicle configuration.",
        },
        {
          q: "Can you pick up passengers from Galleria hotels?",
          a: "Yes. We provide private pickups and drop-offs at hotels, residences, offices, shopping destinations, and event venues throughout Galleria and Uptown Houston.",
        },
        {
          q: "Do you provide airport transportation for groups?",
          a: "Yes. We offer private sedan, SUV, and Sprinter transportation between the Galleria area and both Houston airports.",
        },
        {
          q: "Can I book a chauffeur for multiple stops?",
          a: "Absolutely. Hourly chauffeur service is available for shopping, dining, meetings, and custom group itineraries.",
        },
        {
          q: "How much does Galleria Sprinter transportation cost?",
          a: "Pricing depends on passenger count, route, vehicle requirements, and reservation duration. Contact Jean Limo for a personalized quote.",
        },
      ]}
    />
  );
}
