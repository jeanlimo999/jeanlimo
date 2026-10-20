import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Galleria Car Service & Sprinter Van | Jean Limo",
  description:
    "Luxury Houston Galleria car service, private IAH and Hobby airport transfers, executive chauffeurs, and Mercedes-Benz Sprinter van transportation. Book Jean Limo.",
  alternates: {
    canonical: "https://jeanlimo.com/galleria-car-service",
  },
  openGraph: {
    title: "Houston Galleria Car Service & Sprinter Van | Jean Limo",
    description:
      "Luxury Houston Galleria car service, private IAH and Hobby airport transfers, executive chauffeurs, and Mercedes-Benz Sprinter van transportation. Book Jean Limo.",
    url: "https://jeanlimo.com/galleria-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Galleria / Uptown"
      title="Houston Galleria Car Service & Sprinter Van Transportation"
      intro="Luxury Black Car Service • Airport Transfers • Group Transportation. Experience premium private transportation in Houston’s Galleria and Uptown district with Jean Limo. From luxury airport transfers and executive travel to corporate events, weddings, and group outings, our professional chauffeur service makes every journey comfortable, convenient, and stress-free. Whether you’re traveling alone, with colleagues, or with a large group, enjoy personalized service and luxury vehicles tailored to your transportation needs."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Luxury Mercedes-Benz Sprinter Van & Group Transportation",
        title: "Big Group? Ride Together in Style.",
        body: "Keep your entire group together with Jean Limo’s Mercedes-Benz Sprinter transportation. Skip the hassle of multiple vehicles, coordinating pickups, and managing separate arrivals. Perfect for airport transfers, corporate teams, conferences, weddings, sporting events, concerts, and private celebrations. More Space. More Comfort. One Group. One Ride.",
        cta: "Get a Sprinter Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "Your Airport Ride, Simplified. Reliable private airport transportation between the Galleria, IAH, and Hobby. Ideal for business travelers, families, and groups." },
        { title: "Luxury Black Car Service", body: "Travel First Class, Every Mile. Premium sedans and SUVs with professional chauffeurs for executives, hotel guests, and special occasions." },
        { title: "Mercedes-Benz Sprinter Van Service", body: "More Space. More Comfort. Travel Together. Spacious luxury Sprinter transportation for airport transfers, corporate teams, families, and private group travel." },
        { title: "Large Group Transportation", body: "One Group. One Ride. Less Hassle. Convenient private group transportation for conferences, conventions, weddings, sporting events, concerts, and celebrations." },
        { title: "Corporate & Executive Transportation", body: "Professional Transportation for Business. Dependable chauffeur service for corporate travelers, executive airport transfers, business meetings, and VIP guests." },
        { title: "Hourly Chauffeur Service", body: "Your Schedule. Your Chauffeur. Flexible private transportation for shopping, dining, business appointments, sightseeing, and custom itineraries." },
      ]}
      points={[
        "Professional chauffeurs dedicated to quality service",
        "Premium sedans, SUVs, and Mercedes-Benz Sprinter options",
        "Private and personalized service around your schedule",
        "Options for solo travelers, families, and large groups",
        "Coverage across Galleria, Uptown, Sugar Land, Downtown, and more",
        "One-way, round trip, airport, and hourly booking options",
      ]}
      sections={[
        {
          heading: "Mercedes-Benz Sprinter Van & Large Group Transportation",
          body: "Travel Together. Arrive Together. Our Sprinter is ideal for corporate teams and business conferences, group airport pickups and drop-offs, weddings and private celebrations, Houston Texans games and sporting events, concerts, conventions, and entertainment, family vacations and group sightseeing, and shopping trips and private dining. Whether you need a one-way transfer, round trip, or hourly service, we coordinate based on your group size, luggage, and itinerary.",
        },
        {
          heading: "Galleria & Uptown Houston Transportation",
          body: "Jean Limo serves Houston’s Galleria and Uptown district with convenient private transportation for hotel guests, business travelers, residents, and visitors. Popular destinations: The Galleria Shopping Center, The Post Oak Hotel at Uptown Houston, The Westin Galleria Houston, Hyatt Regency Houston/Galleria, Uptown Park, Post Oak Boulevard, River Oaks, Tanglewood, and nearby corporate offices and residences. We also connect the Galleria with Downtown Houston, Memorial, the Energy Corridor, Sugar Land, IAH, Hobby, and the Port of Galveston.",
        },
        {
          heading: "Galleria Airport Transportation — IAH & Hobby",
          body: "Travel between the Galleria district and both major Houston airports with comfortable, private transportation. Whether you’re arriving for a business meeting, checking into a luxury hotel, or departing with a large group, we offer options tailored to your itinerary. Choose a luxury sedan or SUV for private travel, or request a Mercedes-Benz Sprinter for group airport transfers with passengers and luggage.",
        },
        {
          heading: "Why Travelers Choose Jean Limo",
          body: "Luxury Vehicles. Professional Chauffeurs. Personalized Service. Professional chauffeurs who are courteous and experienced. Luxury vehicle options including premium sedans, SUVs, and Mercedes-Benz Sprinter transportation. Private service arranged around your schedule and preferences. Options for solo travelers, families, corporate teams, and large groups. Houston area coverage including Galleria, Uptown, Sugar Land, Downtown, and surrounding communities. Flexible booking for one-way transfers, round trips, airport transportation, and hourly chauffeur service.",
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
          a: "Yes. Jean Limo provides private Mercedes-Benz Sprinter transportation for corporate groups, airport transfers, weddings, sporting events, and special occasions. Passenger and luggage capacity depend on the vehicle configuration.",
        },
        {
          q: "Can you pick up passengers from Galleria hotels?",
          a: "Yes. We provide private pickup and drop-off service at hotels throughout Houston’s Galleria and Uptown district, including The Post Oak Hotel, The Westin Galleria, Hyatt Regency Houston/Galleria, and nearby properties.",
        },
        {
          q: "Do you provide airport transportation from the Galleria to IAH and Hobby?",
          a: "Yes. Jean Limo offers private transfers between the Galleria and both George Bush Intercontinental Airport (IAH) and William P. Hobby Airport (HOU), with vehicle options for individual travelers and groups.",
        },
        {
          q: "Can I book a Sprinter van for a wedding or corporate event?",
          a: "Absolutely. Our Sprinter transportation is available for weddings, business meetings, corporate conferences, private events, concerts, and group outings.",
        },
        {
          q: "Do you offer hourly chauffeur service in Houston?",
          a: "Yes. Our hourly chauffeur service is ideal for business appointments, shopping, dining, sightseeing, special occasions, and transportation involving multiple stops.",
        },
        {
          q: "How much does Sprinter van transportation cost in Houston?",
          a: "Pricing depends on the number of passengers, pickup and drop-off locations, service duration, and itinerary. Contact Jean Limo for a personalized quote based on your transportation needs.",
        },
        {
          q: "Do you provide transportation outside the Galleria area?",
          a: "Yes. Jean Limo serves the greater Houston area, including Sugar Land, River Oaks, Downtown Houston, Memorial, the Energy Corridor, both major Houston airports, and the Port of Galveston.",
        },
      ]}
    />
  );
}
