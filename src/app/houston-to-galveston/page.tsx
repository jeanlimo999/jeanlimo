import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston to Galveston Cruise Transportation | Jean Limo",
  description:
    "Private transfers from Houston to the Port of Galveston cruise terminals. Timed pickups, luggage space, SUV and Sprinter options.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-to-galveston",
  },
  openGraph: {
    title: "Houston to Galveston Cruise Transportation | Jean Limo",
    description:
      "Private transfers from Houston to Port of Galveston cruise terminals with luggage space.",
    url: "https://jeanlimo.com/houston-to-galveston",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Houston to Galveston Cruise Transportation",
  description:
    "Private transfers from Houston to Port of Galveston cruise terminals.",
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
  areaServed: { "@type": "City", name: "Houston" },
  serviceType: "Cruise Transfer",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServicePage
        kicker="Galveston Cruise"
        title="Houston to Galveston Cruise Transportation"
        intro="Private transfers from Houston-area homes, hotels, and airports to the Port of Galveston cruise terminals. Jean Limo times pickups to your ship’s boarding window and provides vehicles with space for luggage."
        image="/fleet/sprinter.jpg"
        highlight={{
          kicker: "Timed for Your Ship",
          title: "Door-to-Terminal Cruise Transfers",
          body: "Share your boarding time when booking. We suggest a pickup window with buffer and handle return transfers after disembarkation.",
          cta: "Get Instant Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Port of Galveston", body: "Direct transfers to the cruise terminals." },
          { title: "Luggage Space", body: "SUV and Sprinter options for multiple suitcases." },
          { title: "Airport Connections", body: "Pickups from IAH and Hobby." },
          { title: "Hotel & Home Pickups", body: "Downtown, Galleria, Sugar Land, Katy, and more." },
          { title: "Group Transfers", body: "Sprinter for families and larger parties." },
          { title: "Return Service", body: "Book your return after the cruise." },
        ]}
        points={[
          "Timed pickups based on ship schedule",
          "Space for luggage",
          "SUV and Sprinter options",
          "Flat-rate pricing",
          "Pickups from airports, hotels, and homes",
        ]}
        sections={[
          {
            heading: "Common Pickup Points",
            body: "Downtown Houston hotels, Galleria area, Sugar Land, Katy, IAH, Hobby, and The Woodlands.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/katy-car-service", label: "Katy" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/galleria-car-service", label: "Galleria" },
        ]}
        faqs={[
          { q: "How early should we leave for the cruise port?", a: "Share your ship’s boarding time and we will suggest a pickup window with buffer." },
          { q: "Can you pick up from both Houston airports?", a: "Yes. We regularly do IAH and Hobby to Galveston transfers." },
          { q: "Do you offer group transportation to Galveston?", a: "Yes. Sprinter vans are available for groups with luggage." },
        ]}
      />
    </>
  );
}
