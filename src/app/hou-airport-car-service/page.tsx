import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Hobby Airport Car Service Houston (HOU) | Jean Limo",
  description:
    "Reliable Hobby Airport (HOU) car service with professional chauffeurs. Flat rates, flight tracking, and door-to-door transfers in Houston. Instant quote.",
  alternates: {
    canonical: "https://jeanlimo.com/hou-airport-car-service",
  },
  openGraph: {
    title: "Hobby Airport Car Service Houston (HOU) | Jean Limo",
    description:
      "Reliable Hobby Airport (HOU) car service with professional chauffeurs. Flat rates, flight tracking, and door-to-door transfers in Houston. Instant quote.",
    url: "https://jeanlimo.com/hou-airport-car-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hobby Airport Car Service Houston (HOU)",
  description:
    "Reliable Hobby Airport (HOU) car service with professional chauffeurs. Flat rates, flight tracking, and door-to-door transfers in Houston.",
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
        kicker="Hobby airport"
        title="Hobby Airport Car Service Houston (HOU)"
        intro="Private car service to and from William P. Hobby Airport (HOU). Jean Limo offers flat-rate transfers with professional chauffeurs, flight monitoring, and door-to-door service across Greater Houston. Hobby is convenient for many Houston travelers — we make the ground portion of your trip just as straightforward."
        points={[
          "Door-to-door Hobby Airport pickup and drop-off",
          "Flight monitoring when you provide your flight number",
          "Business Sedan, Business SUV, or Sprinter Van",
          "Flat rates with gratuity and fuel included on most local trips",
          "Professional chauffeurs and 24/7 dispatch",
        ]}
        sections={[
          {
            heading: "Popular Routes from Hobby",
            body: "Hobby to Downtown Houston, the Galleria / Uptown, Texas Medical Center, Sugar Land, Katy, and Port of Galveston.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/houston-black-car-service", label: "Black Car Service" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/pearland-car-service", label: "Pearland" },
          { href: "/clear-lake-car-service", label: "Clear Lake" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/galleria-car-service", label: "Galleria" },
        ]}
        faqs={[
          {
            q: "Do you serve all terminals at Hobby?",
            a: "Yes.",
          },
          {
            q: "Can I book a round trip?",
            a: "Yes. You can book both directions in one reservation.",
          },
        ]}
      />
    </>
  );
}
