import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Black Car Service | Private Chauffeur | Jean Limo",
  description:
    "Houston black car service for airport runs, corporate travel, and nights out. Business sedans and SUVs with flat rates and professional chauffeurs. Serving Greater Houston.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-black-car-service",
  },
  openGraph: {
    title: "Houston Black Car Service | Private Chauffeur | Jean Limo",
    description:
      "Houston black car service for airport runs, corporate travel, and nights out. Business sedans and SUVs with flat rates and professional chauffeurs.",
    url: "https://jeanlimo.com/houston-black-car-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Houston Black Car Service",
  description:
    "Houston black car service for airport runs, corporate travel, and nights out. Business sedans and SUVs with flat rates and professional chauffeurs.",
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
  serviceType: "Black Car Service",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicePage
        kicker="Houston black car"
        title="Houston Black Car Service"
        intro="Jean Limo provides private black car and chauffeur service throughout Greater Houston. Choose a business sedan or full-size SUV with a professional, background-checked chauffeur for airport transfers, corporate meetings, client entertainment, nights out, or personal travel. Every ride is confirmed by dispatch and priced clearly before you book."
        points={[
          "Business sedans and full-size SUVs",
          "Flat rates with gratuity and fuel included (Greater Houston)",
          "Airport transfers to IAH and Hobby",
          "Corporate and executive travel",
          "24/7 dispatch and no surge pricing",
          "Licensed, insured, and background-checked chauffeurs",
          "Door-to-door private service",
        ]}
        sections={[
          {
            heading: "Ideal For",
            body: "Airport runs, corporate roadshows, client meetings and dinners, nights out, weddings, and point-to-point trips across the city. Black car service is a reliable alternative to rideshare when you want a professional driver, clean vehicle, and fixed price.",
          },
          {
            heading: "Vehicle Options",
            body: "Business sedans (Mercedes E-Class, BMW 5 Series, or similar) seat up to 3 passengers with luggage. Full-size SUVs (Chevrolet Suburban, GMC Yukon XL, or similar) seat up to 6 passengers and handle more bags. For larger groups, we also offer Mercedes-Benz Sprinter vans.",
          },
          {
            heading: "Coverage Area",
            body: "We serve Greater Houston including Downtown, the Galleria, River Oaks, Memorial, Sugar Land, The Woodlands, Katy, the Energy Corridor, Medical Center, and surrounding communities. Flat rates apply on most trips within the greater Houston area.",
          },
        ]}
        relatedLinks={[
          { href: "/iah-airport-car-service", label: "IAH Airport" },
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/river-oaks-car-service", label: "River Oaks" },
          { href: "/memorial-car-service", label: "Memorial" },
          { href: "/galleria-car-service", label: "Galleria" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        ]}
        faqs={[
          {
            q: "What vehicles do you use for black car service?",
            a: "Business sedans (Mercedes E-Class, BMW 5 Series or similar) and full-size SUVs (Suburban, Yukon XL or similar). Sprinter vans are available for larger groups.",
          },
          {
            q: "Is gratuity included?",
            a: "Yes, on standard point-to-point rates within Greater Houston. Fuel is also included.",
          },
          {
            q: "Do you offer hourly black car service?",
            a: "Yes. Hourly chauffeur service is available with a 2-hour minimum for as-directed travel and multiple stops.",
          },
          {
            q: "How is black car different from rideshare?",
            a: "You get a professional, background-checked chauffeur, a clean late-model vehicle, a fixed price in advance, and confirmed service. There is no surge pricing.",
          },
          {
            q: "Can I book for a corporate account or multiple trips?",
            a: "Yes. Contact us for recurring or corporate transportation needs.",
          },
        ]}
      />
    </>
  );
}
