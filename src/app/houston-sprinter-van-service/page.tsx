import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Mercedes-Benz Sprinter Van Rental with Driver | Jean Limo",
  description:
    "Mercedes-Benz Sprinter van service in Houston with professional driver. Group airport transfers, weddings, conferences, and events. Book a Sprinter quote.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-sprinter-van-service",
  },
  openGraph: {
    title: "Houston Mercedes-Benz Sprinter Van Rental with Driver | Jean Limo",
    description:
      "Mercedes-Benz Sprinter van service in Houston with professional driver for groups, airports, and events.",
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
        intro="Travel as one group in a Mercedes-Benz Sprinter with a professional chauffeur. Jean Limo provides Sprinter service for airport transfers, weddings, corporate conferences, sporting events, and private celebrations across Greater Houston."
        image="/fleet/sprinter.jpg"
        highlight={{
          kicker: "One Vehicle for the Whole Group",
          title: "Skip Multiple Cars. Ride Together.",
          body: "Ideal for corporate teams, wedding parties, airport groups with luggage, and event transportation. Capacity depends on configuration — contact us with your passenger count and luggage needs for a quote.",
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
          "Suitable for groups with luggage",
          "Airport, event, and hourly options",
          "One confirmation for the whole group",
          "Available across Greater Houston",
        ]}
        sections={[
          {
            heading: "When a Sprinter Makes Sense",
            body: "Choose a Sprinter when you have more passengers than a sedan or SUV can comfortably handle, or when you want everyone to arrive at the same time. Common uses include corporate roadshows, wedding transportation, and family airport runs.",
          },
          {
            heading: "How to Book",
            body: "Tell us your passenger count, pickup and drop-off locations, date, and any luggage or special requests. We will confirm availability and provide a quote. Capacity varies by vehicle configuration.",
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
        ]}
        faqs={[
          {
            q: "How many passengers can the Sprinter hold?",
            a: "Capacity depends on the specific vehicle configuration and luggage. Contact us with your group size for an accurate answer.",
          },
          {
            q: "Do you offer Sprinter service for weddings?",
            a: "Yes. Sprinter transportation is available for wedding parties and related events.",
          },
          {
            q: "Can I book a Sprinter for IAH or Hobby?",
            a: "Yes. Sprinter vans are commonly used for group airport transfers.",
          },
          {
            q: "Is a driver included?",
            a: "Yes. All Sprinter service includes a professional chauffeur.",
          },
        ]}
      />
    </>
  );
}
