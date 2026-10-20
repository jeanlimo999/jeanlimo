import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Sugar Land to Hobby Airport Car Service (HOU) | Jean Limo",
  description:
    "Private car service from Sugar Land to Hobby Airport (HOU). Flight monitoring, flat rates, professional chauffeurs. Door-to-door transfers for business and leisure travelers.",
  alternates: {
    canonical: "https://jeanlimo.com/sugar-land-to-hou",
  },
  openGraph: {
    title: "Sugar Land to Hobby Airport Car Service (HOU) | Jean Limo",
    description:
      "Private car service from Sugar Land to Hobby Airport (HOU). Flight monitoring, flat rates, professional chauffeurs. Door-to-door transfers.",
    url: "https://jeanlimo.com/sugar-land-to-hou",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sugar Land to Hobby Airport Car Service (HOU)",
  description:
    "Private car service from Sugar Land to William P. Hobby Airport (HOU). Flight monitoring, flat rates, and professional chauffeurs.",
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
        kicker="Sugar Land to HOU"
        title="Sugar Land to Hobby Airport Car Service (HOU)"
        intro="Private car service from Sugar Land to William P. Hobby Airport (HOU). Jean Limo is based in Sugar Land and regularly handles this shorter airport route for business travelers, families, and groups. We monitor your flight when you share the number, provide flat-rate pricing, and deliver a professional chauffeur in a clean late-model vehicle."
        points={[
          "Door-to-door Sugar Land to Hobby Airport (HOU) transfers",
          "Flight monitoring for arrivals and departures",
          "Typical drive time 20–35 minutes depending on traffic",
          "Business Sedan, Business SUV, or Sprinter Van",
          "Flat rates with gratuity and fuel included on most trips",
          "Meet and greet available at HOU arrivals",
          "24/7 dispatch and background-checked chauffeurs",
        ]}
        sections={[
          {
            heading: "Sugar Land to HOU Route",
            body: "Most trips from Sugar Land to Hobby Airport take 20–35 minutes depending on time of day and traffic on the Southwest Freeway and local roads. Hobby is closer than IAH for many southwest Houston travelers. We time pickups for departures with appropriate buffer and monitor inbound flights so your chauffeur is ready when you land. Common pickup areas include Sugar Land Town Square, First Colony, New Territory, and surrounding neighborhoods.",
          },
          {
            heading: "Why Book Jean Limo for This Route",
            body: "As a Sugar Land-based operator, we know the local roads to Hobby and the terminal layout. Every reservation is confirmed by dispatch, and you receive clear pickup instructions. Book online for an instant quote or call if you need a same-day pickup.",
          },
        ]}
        relatedLinks={[
          { href: "/hou-airport-car-service", label: "Hobby Airport Service" },
          { href: "/sugar-land-car-service", label: "Sugar Land Car Service" },
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/sugar-land-to-iah", label: "Sugar Land to IAH" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/missouri-city-car-service", label: "Missouri City" },
          { href: "/stafford-car-service", label: "Stafford" },
          { href: "/richmond-car-service", label: "Richmond" },
          { href: "/houston-black-car-service", label: "Black Car" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        ]}
        faqs={[
          {
            q: "How long does it take from Sugar Land to Hobby Airport?",
            a: "Typically 20–35 minutes depending on traffic. We recommend allowing extra time during peak hours and monitor flights for arrivals.",
          },
          {
            q: "Do you track flights for Sugar Land pickups to HOU?",
            a: "Yes. Share your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
          },
          {
            q: "Is meet and greet available at Hobby Airport?",
            a: "Yes. We can meet you at arrivals or baggage claim.",
          },
          {
            q: "Can I book a round trip from Sugar Land to HOU?",
            a: "Yes. Book both directions in one reservation.",
          },
        ]}
      />
    </>
  );
}
