import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Mercedes-Benz Sprinter Van Rental with Driver | Jean Limo",
  description:
    "Mercedes-Benz Sprinter van service in Houston with a professional driver. Group airport transfers to IAH and Hobby, weddings, corporate events, and Galveston cruises. Up to 14 passengers. Book online.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-sprinter-van-service",
  },
  openGraph: {
    title: "Houston Mercedes-Benz Sprinter Van Rental with Driver | Jean Limo",
    description:
      "Mercedes-Benz Sprinter van service in Houston with a professional driver. Group airport transfers to IAH and Hobby, weddings, corporate events, and Galveston cruises. Up to 14 passengers.",
    url: "https://jeanlimo.com/houston-sprinter-van-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Houston Mercedes-Benz Sprinter Van Service",
  description:
    "Mercedes-Benz Sprinter van service in Houston with professional driver for group airport transfers, events, and private travel.",
  provider: {
    "@type": "LocalBusiness",
    name: "Jean Limo LLC",
    telephone: "+12819170085",
    address: {
      "@type": "PostalAddress",
      streetAddress: "11002 Myrtle Dr",
      addressLocality: "Sugar Land",
      addressRegion: "TX",
      postalCode: "77498",
      addressCountry: "US",
    },
  },
  areaServed: {
    "@type": "City",
    name: "Houston",
  },
  serviceType: "Sprinter Van Service",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicePage
        kicker="Group Transportation"
        title="Houston Mercedes-Benz Sprinter Van Rental with Driver"
        intro="Travel as one group in a Mercedes-Benz Sprinter with a professional chauffeur. Jean Limo provides Sprinter service for airport transfers, weddings, corporate conferences, sporting events, and private celebrations across Greater Houston. Ideal when you have more passengers or luggage than an SUV can handle."
        image="/fleet/sprinter.jpg"
        highlight={{
          kicker: "One Vehicle for the Whole Group",
          title: "Skip Multiple Cars. Ride Together.",
          body: "Ideal for corporate teams, wedding parties, airport groups with luggage, and event transportation. Typical capacity is up to 14 passengers depending on luggage and configuration. Contact us with your exact passenger count and bag needs for confirmation.",
          cta: "Get a Sprinter Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Group Airport Transfers", body: "IAH and Hobby arrivals and departures for multiple passengers and luggage." },
          { title: "Weddings & Celebrations", body: "Keep the party together for ceremonies, receptions, and photo locations." },
          { title: "Corporate & Conferences", body: "Transport teams to meetings, conventions, and off-site events." },
          { title: "Sporting Events & Concerts", body: "NRG Stadium, Toyota Center, and other Houston venues." },
          { title: "Hourly Service", body: "Flexible as-directed service for multiple stops." },
          { title: "Cruise Port Transfers", body: "Galveston transfers with space for group luggage." },
        ]}
        points={[
          "Professional chauffeur included",
          "Up to 14 passengers (configuration dependent)",
          "Space for luggage on airport and cruise trips",
          "One confirmation for the whole group",
          "Available across Greater Houston",
          "Sedan and SUV alternatives available for smaller groups",
        ]}
        sections={[
          {
            heading: "When a Sprinter Makes Sense",
            body: "Choose a Sprinter when you have more passengers than a sedan or SUV can comfortably handle, when the group has significant luggage, or when you want everyone to arrive and leave together. Common uses include corporate roadshows, wedding transportation, family airport runs, conference shuttles, and sporting events. If your group is 6 or fewer with light luggage, an SUV may be a better fit.",
          },
          {
            heading: "Capacity and Luggage",
            body: "Passenger capacity depends on the specific vehicle configuration and the amount of luggage. A typical Sprinter can seat up to 14 passengers. With large suitcases or multiple bags per person, the practical limit is often lower so everyone and their luggage fit comfortably. Share your passenger count and luggage details when booking so we can confirm the right vehicle.",
          },
          {
            heading: "How to Book a Sprinter",
            body: "Tell us your passenger count, pickup and drop-off locations, date, time, and any luggage or special requests. We confirm availability and provide a quote. Capacity varies by configuration, so early details help us match the right vehicle. Sprinters are available for point-to-point transfers and hourly service.",
          },
          {
            heading: "Popular Sprinter Routes",
            body: "Group transfers to and from IAH and Hobby airports, Galveston cruise port runs, trips between hotels and NRG Stadium or Toyota Center, corporate shuttles between offices and meeting venues, and wedding transportation across Greater Houston. We serve Sugar Land, the Galleria, Downtown, The Woodlands, Katy, and surrounding areas.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/galleria-car-service", label: "Galleria" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/houston-black-car-service", label: "Black Car" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        ]}
        faqs={[
          {
            q: "How many passengers can the Sprinter hold?",
            a: "Up to 14 passengers depending on the vehicle configuration and luggage. With significant luggage, the practical limit is often lower. Contact us with your group size and bag count for confirmation.",
          },
          {
            q: "Do you offer Sprinter service for weddings?",
            a: "Yes. Sprinter transportation is available for wedding parties, ceremonies, receptions, and related events.",
          },
          {
            q: "Can I book a Sprinter for IAH or Hobby?",
            a: "Yes. Sprinter vans are commonly used for group airport transfers with luggage.",
          },
          {
            q: "Is a driver included?",
            a: "Yes. All Sprinter service includes a professional chauffeur.",
          },
          {
            q: "When should I choose a Sprinter instead of an SUV?",
            a: "Choose a Sprinter for groups larger than 6, trips with substantial luggage, or when you want the entire party to travel in one vehicle. For smaller groups with light luggage, an SUV is usually sufficient.",
          },
          {
            q: "Is hourly Sprinter service available?",
            a: "Yes. Hourly chauffeur service is available with a minimum. Contact us with your itinerary for a quote.",
          },
        ]}
      />
    </>
  );
}
