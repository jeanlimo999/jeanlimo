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
      intro="Luxury Black Car Service • Airport Transfers • Group Transportation. Experience premium chauffeur service in Houston’s Galleria and Uptown district with Jean Limo. From private airport transfers and executive travel to weddings, corporate events, and large group transportation, we provide professional chauffeurs and comfortable luxury vehicles for every occasion."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Luxury Group Transportation",
        title: "Big Group? Ride Together in Style.",
        body: "Make every group trip more convenient with Jean Limo’s Mercedes-Benz Sprinter transportation. Whether you’re arranging an airport pickup, attending a corporate event, celebrating a wedding, or heading to a Houston sporting event, our Sprinter service offers a comfortable and convenient way to travel together.",
        cta: "Get a Sprinter Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Your Airport Ride, Simplified. Comfortable private transportation between the Galleria and IAH or Hobby." },
        { title: "Luxury Black Car Service", body: "Travel First Class, Every Mile. Premium sedans and SUVs for business travelers, executives, and hotel guests." },
        { title: "Mercedes-Benz Sprinter Van Service", body: "More Space. More Comfort. Travel Together. Luxury Sprinter transportation for families, corporate teams, and special occasions." },
        { title: "Large Group Transportation", body: "One Group. One Ride. Less Hassle. Private group transportation for conferences, weddings, conventions, concerts, and sporting events." },
        { title: "Corporate & Executive Transportation", body: "Professional Transportation for Business. Dependable chauffeur service for meetings, executive airport transfers, and VIP guests." },
        { title: "Hourly Chauffeur Service", body: "Your Schedule. Your Chauffeur. Flexible hourly transportation for shopping, dining, meetings, and custom itineraries." },
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
          heading: "Mercedes-Benz Sprinter Van & Large Group Transportation",
          body: "Skip multiple cars. Keep your group together. Perfect for corporate teams and business conferences, airport transfers with passengers and luggage, weddings and private celebrations, concerts and sporting events, family vacations and sightseeing, conventions and group outings, and private shopping and dining experiences. Request a personalized Sprinter quote based on your passenger count, luggage, and itinerary.",
        },
        {
          heading: "Galleria & Uptown Houston Transportation",
          body: "Jean Limo proudly serves Houston’s Galleria and Uptown district, including popular hotels, shopping destinations, residential communities, and corporate offices. Popular locations: The Galleria Shopping Center, The Post Oak Hotel at Uptown Houston, The Westin Galleria Houston, Hyatt Regency Houston/Galleria, Uptown Park, Post Oak Boulevard, River Oaks, and Tanglewood. We also connect the Galleria with Downtown Houston, Memorial, Sugar Land, the Energy Corridor, IAH, Hobby, and the Port of Galveston.",
        },
        {
          heading: "Why Travelers Choose Jean Limo",
          body: "Luxury Vehicles. Professional Chauffeurs. Personalized Service. Whether you’re visiting Houston for business, enjoying a weekend getaway, or coordinating transportation for a large group, Jean Limo makes getting around easier. Enjoy professional service, comfortable vehicles, flexible scheduling, and transportation tailored to your needs. From one passenger to large groups — your journey matters.",
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
          q: "Do you provide airport transportation for groups?",
          a: "Yes. Our SUVs and Mercedes-Benz Sprinter vans offer private airport transportation for groups traveling to or from IAH and Hobby Airport.",
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
