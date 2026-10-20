import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Hobby Airport Private Car Service | Jean Limo",
  description:
    "Private car service to William P. Hobby Airport (HOU). Flight monitoring, flat rates, sedan, SUV, and Sprinter options across Greater Houston.",
  alternates: {
    canonical: "https://jeanlimo.com/hou-airport-car-service",
  },
  openGraph: {
    title: "Hobby Airport Private Car Service | Jean Limo",
    description:
      "Private car service to William P. Hobby Airport (HOU). Flight monitoring and door-to-door transfers.",
    url: "https://jeanlimo.com/hou-airport-car-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hobby Airport Private Car Service",
  description:
    "Private car service to William P. Hobby Airport with flight monitoring and professional chauffeurs.",
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
  serviceType: "Airport Car Service",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <ServicePage
        kicker="Hobby Airport"
        title="Hobby Airport Private Car Service"
        intro="Private transfers to and from William P. Hobby Airport (HOU). Jean Limo monitors flights when you share the number and provides sedan, SUV, or Sprinter service for individuals and groups across Greater Houston."
        image="/fleet/suv.jpg"
        highlight={{
          kicker: "Convenient South Houston Airport",
          title: "Hobby Transfers with Flight Tracking",
          body: "Share your flight number at booking. We track arrivals and departures so your chauffeur is timed correctly.",
          cta: "Get Instant Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Arrival & Departure", body: "Door-to-door service with flight monitoring." },
          { title: "Sedan & SUV", body: "Private travel for individuals and small groups." },
          { title: "Sprinter for Groups", body: "One vehicle for multiple passengers and luggage." },
          { title: "Popular Routes", body: "Downtown, Galleria, Medical Center, Sugar Land, and Pearland." },
          { title: "Round Trips", body: "Book both directions in one reservation." },
          { title: "24/7 Availability", body: "Early and late flights covered." },
        ]}
        points={[
          "Flight monitoring available",
          "Business Sedan, SUV, or Sprinter",
          "Flat rates on most local trips",
          "Professional chauffeurs",
          "Door-to-door service",
        ]}
        sections={[
          {
            heading: "Popular Routes from Hobby",
            body: "Downtown Houston, Galleria / Uptown, Texas Medical Center, Sugar Land, Pearland, Clear Lake, and Port of Galveston. Drive times vary with traffic.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/pearland-car-service", label: "Pearland" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/galleria-car-service", label: "Galleria" },
        ]}
        faqs={[
          { q: "Do you serve all terminals at Hobby?", a: "Yes." },
          { q: "Can I book a round trip?", a: "Yes. Book both directions in one reservation." },
          { q: "Do you track flights at Hobby?", a: "Yes. Provide your flight number and we monitor it." },
        ]}
      />
    </>
  );
}
