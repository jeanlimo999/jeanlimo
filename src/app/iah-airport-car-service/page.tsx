import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IAH Airport Car Service Houston | Jean Limo",
  description:
    "Private IAH airport car service with flight monitoring and meet & greet. Flat-rate sedan, SUV, and Sprinter transfers across Greater Houston. Book online.",
  alternates: {
    canonical: "https://jeanlimo.com/iah-airport-car-service",
  },
  openGraph: {
    title: "IAH Airport Car Service Houston | Jean Limo",
    description:
      "Private IAH airport car service with flight monitoring and meet & greet. Flat-rate sedan, SUV, and Sprinter transfers across Greater Houston. Book online.",
    url: "https://jeanlimo.com/iah-airport-car-service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "IAH Airport Car Service Houston",
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
        kicker="IAH airport"
        title="IAH Airport Car Service Houston"
        intro="Private IAH airport car service with professional chauffeurs, flight monitoring, and flat-rate pricing. Jean Limo provides door-to-door transfers to and from George Bush Intercontinental Airport for business travelers, families, and groups across Greater Houston. Whether you are arriving on an international flight or departing from Terminals A–E, we coordinate your pickup based on your actual flight details so you are not left waiting."
        points={[
          "Door-to-door IAH pickup and drop-off",
          "Flight monitoring when you share your flight number",
          "Meet and greet available at arrivals or baggage claim",
          "Business Sedan, Business SUV, or Sprinter Van",
          "Flat rates with gratuity and fuel included on most Greater Houston trips",
          "24/7 dispatch and professional, background-checked chauffeurs",
        ]}
        sections={[
          {
            heading: "How IAH Airport Transfers Work",
            body: "Share your flight number and addresses when booking. We monitor the flight for delays or early arrivals. Your chauffeur meets you at the designated location with clear instructions. Enjoy a direct, comfortable ride in a clean late-model vehicle.",
          },
          {
            heading: "Service Area",
            body: "We regularly serve travelers going to and from The Woodlands, Sugar Land, Katy, Downtown Houston, the Galleria, Texas Medical Center, Spring, Tomball, and surrounding communities.",
          },
        ]}
        relatedLinks={[
          { href: "/hou-airport-car-service", label: "Hobby Airport" },
          { href: "/houston-black-car-service", label: "Black Car Service" },
          { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
          { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
          { href: "/houston-to-galveston", label: "Galveston Cruise" },
          { href: "/the-woodlands-car-service", label: "The Woodlands" },
          { href: "/sugar-land-car-service", label: "Sugar Land" },
          { href: "/katy-car-service", label: "Katy" },
          { href: "/downtown-houston-car-service", label: "Downtown" },
          { href: "/galleria-car-service", label: "Galleria" },
        ]}
        faqs={[
          {
            q: "Do you track flights?",
            a: "Yes. Provide your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
          },
          {
            q: "Is meet & greet available?",
            a: "Yes. We can meet you inside the terminal or at baggage claim.",
          },
          {
            q: "How much does IAH transportation cost?",
            a: "Rates are flat and based on distance. Gratuity and fuel are included on standard Greater Houston trips. Get an instant quote online.",
          },
          {
            q: "How far in advance should I book?",
            a: "Book as soon as your travel is confirmed. Same-day requests are often possible.",
          },
        ]}
      />
    </>
  );
}
