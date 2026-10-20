import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Sugar Land to IAH Airport Car Service | Jean Limo",
  description:
    "Private car service from Sugar Land to IAH Airport. Flight monitoring, flat rates, professional chauffeurs. Door-to-door transfers for business and leisure travelers.",
  alternates: {
    canonical: "https://jeanlimo.com/sugar-land-to-iah",
  },
  openGraph: {
    title: "Sugar Land to IAH Airport Car Service | Jean Limo",
    description:
      "Private car service from Sugar Land to IAH Airport. Flight monitoring, flat rates, professional chauffeurs. Door-to-door transfers.",
    url: "https://jeanlimo.com/sugar-land-to-iah",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sugar Land to IAH Airport Car Service",
  description:
    "Private car service from Sugar Land to George Bush Intercontinental Airport (IAH). Flight monitoring, flat rates, and professional chauffeurs.",
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
  areaServed: [
    { "@type": "City", name: "Sugar Land" },
    { "@type": "City", name: "Houston" },
  ],
  serviceType: "Airport Car Service",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicePage
        kicker="Sugar Land to IAH"
        title="Sugar Land to IAH Airport Car Service"
        intro="Private car service from Sugar Land to George Bush Intercontinental Airport (IAH). Jean Limo is based in Sugar Land and regularly handles this route for business travelers, families, and groups. We monitor your flight when you share the number, provide flat-rate pricing, and deliver a professional chauffeur in a clean late-model vehicle."
        points={[
          "Door-to-door Sugar Land to IAH transfers",
          "Flight monitoring for arrivals and departures",
          "Typical drive time 35–50 minutes depending on traffic",
          "Business Sedan, Business SUV, or Sprinter Van",
          "Flat rates with gratuity and fuel included on most trips",
          "Meet and greet available at IAH arrivals",
          "24/7 dispatch and background-checked chauffeurs",
        ]}
        sections={[
          {
            heading: "Sugar Land to IAH Route",
            body: "Most trips from Sugar Land to IAH take 35–50 minutes depending on time of day and traffic on the Southwest Freeway and Beltway 8. We time pickups for departures with appropriate buffer and monitor inbound flights so your chauffeur is ready when you land. Common pickup areas include Sugar Land Town Square, First Colony, New Territory, and surrounding neighborhoods.",
          },
          {
            heading: "Why Book Jean Limo for This Route",
            body: "As a Sugar Land-based operator, we know local traffic patterns and the IAH terminal layout. Every reservation is confirmed by dispatch, and you receive clear pickup instructions. Book online for an instant quote or call if you need a same-day pickup.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport Service" },
          { href: "/sugar-land-car-service", label: "Sugar Land Car Service" },
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/missouri-city-car-service", label: "Missouri City" },
          { href: "/stafford-car-service", label: "Stafford" },
          { href: "/richmond-car-service", label: "Richmond" },
          { href: "/houston-black-car-service", label: "Black Car" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        ]}
        faqs={[
          {
            q: "How long does it take from Sugar Land to IAH?",
            a: "Typically 35–50 minutes depending on traffic. We recommend allowing extra time during peak hours and monitor flights for arrivals.",
          },
          {
            q: "Do you track flights for Sugar Land pickups?",
            a: "Yes. Share your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
          },
          {
            q: "Is meet and greet available at IAH?",
            a: "Yes. We can meet you at arrivals or baggage claim.",
          },
          {
            q: "Can I book a round trip from Sugar Land to IAH?",
            a: "Yes. Book both directions in one reservation.",
          },
        ]}
      />
    </>
  );
}
