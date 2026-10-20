import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IAH Airport Black Car & Sprinter Transfers | Jean Limo",
  description:
    "Private IAH airport car service with flight monitoring and meet & greet. Sedan, SUV, and Sprinter transfers across Greater Houston. Book online.",
  alternates: {
    canonical: "https://jeanlimo.com/iah-airport-car-service",
  },
  openGraph: {
    title: "IAH Airport Black Car & Sprinter Transfers | Jean Limo",
    description:
      "Private IAH airport car service with flight monitoring and meet & greet. Sedan, SUV, and Sprinter transfers.",
    url: "https://jeanlimo.com/iah-airport-car-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IAH Airport Black Car & Sprinter Transfers",
  description:
    "Private IAH airport car service with flight monitoring and meet & greet. Flat-rate sedan, SUV, and Sprinter transfers across Greater Houston.",
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
        kicker="IAH Airport"
        title="IAH Airport Black Car & Sprinter Transfers"
        intro="Private car service to and from George Bush Intercontinental Airport (IAH). Jean Limo monitors your flight when you share the number, provides flat-rate pricing, and offers sedan, SUV, or Sprinter options for individuals and groups."
        image="/fleet/suv.jpg"
        highlight={{
          kicker: "Flight Monitoring Included",
          title: "Your Chauffeur Adjusts for Delays",
          body: "Share your flight number at booking. We track arrivals and departures so your pickup is timed correctly, whether the flight is early or delayed.",
          cta: "Get Instant Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Arrival Transfers", body: "Meet and greet available at arrivals or baggage claim." },
          { title: "Departure Transfers", body: "Timed pickups with buffer for security and check-in." },
          { title: "Sedan & SUV", body: "Comfortable private travel for individuals and small groups." },
          { title: "Sprinter for Groups", body: "One vehicle for teams, families, or multiple passengers with luggage." },
          { title: "Greater Houston Coverage", body: "Service to Sugar Land, The Woodlands, Downtown, Galleria, and more." },
          { title: "24/7 Dispatch", body: "Available for early morning and late night flights." },
        ]}
        points={[
          "Flight monitoring when you share your flight number",
          "Meet and greet available",
          "Business Sedan, SUV, or Sprinter",
          "Flat rates on most Greater Houston trips",
          "Professional, background-checked chauffeurs",
          "Door-to-door service",
        ]}
        sections={[
          {
            heading: "How IAH Transfers Work",
            body: "Book online or by phone with your flight details and addresses. We monitor the flight and confirm pickup instructions. Your chauffeur meets you at the agreed location in a clean late-model vehicle.",
          },
          {
            heading: "Popular Routes from IAH",
            body: "Sugar Land (50–60 min), Downtown (25–40 min), Galleria (25–40 min), The Woodlands, Katy, and Texas Medical Center. Exact times vary with traffic.",
          },
        ]}
        relatedLinks={[
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/sugar-land-to-iah", label: "Sugar Land to IAH" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/houston-black-car-service", label: "Black Car" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/galleria-car-service", label: "Galleria" },
          { href: "/the-woodlands-car-service", label: "The Woodlands" },
        ]}
        faqs={[
          {
            q: "Do you track flights for IAH pickups?",
            a: "Yes. Provide your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
          },
          {
            q: "Is meet and greet available at IAH?",
            a: "Yes. We can meet you at arrivals or baggage claim.",
          },
          {
            q: "Can I book a Sprinter from IAH?",
            a: "Yes. Sprinter vans are available for group arrivals and departures.",
          },
          {
            q: "How much does IAH transportation cost?",
            a: "Rates are flat and based on distance. Get an instant quote online.",
          },
        ]}
      />
    </>
  );
}
