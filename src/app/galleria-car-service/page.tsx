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
      intro="Luxury airport transfers, executive transportation, and group travel in Galleria / Uptown Houston. Experience reliable, professional transportation with Jean Limo. From airport pickups and business meetings to shopping trips, private events, and large group transportation, our chauffeurs serve Houston’s Galleria and Uptown area with luxury sedans, SUVs, and Mercedes-Benz Sprinter vans."
      image="/fleet/sprinter.jpg"
      points={[
        "Airport transfers to IAH and Hobby",
        "Luxury black car service with sedans and SUVs",
        "Mercedes-Benz Sprinter van service for groups",
        "Group transportation for events, weddings, and corporate teams",
        "Corporate and executive transportation",
        "Hourly chauffeur service for multiple stops",
        "Flat rates and professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Our Transportation Services",
          body: "Airport Transfers — Private transportation to and from George Bush Intercontinental Airport (IAH) and William P. Hobby Airport (HOU). Luxury Black Car Service — Premium sedans and SUVs for executives, business travelers, and private clients. Mercedes-Benz Sprinter Van Service — Spacious, comfortable transportation for families, corporate teams, and larger groups. Group Transportation — Convenient travel for conferences, conventions, weddings, celebrations, and special events. Corporate Transportation — Professional chauffeur service for meetings, executives, and business events. Hourly Chauffeur Service — Flexible transportation for shopping, dining, multiple appointments, and custom itineraries.",
        },
        {
          heading: "Mercedes Sprinter Van & Large Group Transportation",
          body: "Travel Together. Arrive in Style. Planning a group trip in Houston? Our Mercedes-Benz Sprinter transportation is ideal for larger parties who want to travel together comfortably without booking multiple cars. Perfect for corporate groups and executive teams, airport transfers with multiple passengers and luggage, wedding parties and private celebrations, family outings and group shopping trips, convention and conference transportation, concerts, sporting events, and special occasions. Request a Sprinter quote for your group, luggage, and itinerary.",
        },
        {
          heading: "Why Choose Jean Limo in the Galleria",
          body: "Enjoy professional chauffeurs, clean luxury vehicles, convenient airport transportation, and flexible pickup arrangements throughout Houston’s Galleria and Uptown district. Whether you’re staying at a luxury hotel, attending a business meeting, shopping at The Galleria, or arranging transportation for a larger group, Jean Limo makes travel easier.",
        },
        {
          heading: "Galleria & Uptown Locations We Serve",
          body: "The Galleria Shopping Center, The Post Oak Hotel, The Westin Galleria, Hyatt Regency Houston/Galleria, Uptown Park, Post Oak Boulevard, River Oaks, and Tanglewood. We also provide service connecting the Galleria with Downtown Houston, Memorial, the Energy Corridor, Sugar Land, IAH Airport, and Hobby Airport.",
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
