import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Black Car Service | Private Chauffeur | Jean Limo",
  description:
    "Houston black car service for airport runs, corporate travel, and nights out. Business sedans and SUVs with flat rates and professional chauffeurs.",
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
        intro="Jean Limo provides private black car service throughout Greater Houston. Choose a business sedan or SUV with a professional, background-checked chauffeur for airport transfers, corporate meetings, client entertainment, or personal travel. Every ride is confirmed by dispatch and priced clearly before you book."
        points={[
          "Business sedans and full-size SUVs",
          "Flat rates with gratuity and fuel included (Greater Houston)",
          "Airport transfers to IAH and Hobby",
          "Corporate and executive travel",
          "24/7 dispatch and no surge pricing",
          "Licensed, insured, and background-checked chauffeurs",
        ]}
        sections={[
          {
            heading: "Ideal For",
            body: "Airport runs, corporate roadshows, client meetings and dinners, nights out, and point-to-point trips across the city.",
          },
        ]}
        faqs={[
          {
            q: "What vehicles do you use for black car service?",
            a: "Business sedans (Mercedes E-Class, BMW 5 Series or similar) and full-size SUVs (Suburban, Yukon XL or similar).",
          },
          {
            q: "Is gratuity included?",
            a: "Yes, on standard point-to-point rates within Greater Houston.",
          },
          {
            q: "Do you offer hourly black car service?",
            a: "Yes. See our hourly chauffeur service for as-directed bookings.",
          },
        ]}
      />
    </>
  );
}
