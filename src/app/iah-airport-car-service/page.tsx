import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IAH Airport Black Car & Sprinter Transfers | Jean Limo",
  description:
    "Private IAH airport car service with flight monitoring and meet & greet at Terminals A, B, C, and D. Sedan, SUV, and Sprinter transfers across Greater Houston. Book online.",
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
    "Private IAH airport car service with flight monitoring and meet & greet at Terminals A, B, C, and D. Flat-rate sedan, SUV, and Sprinter transfers across Greater Houston.",
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
        intro="Private car service to and from George Bush Intercontinental Airport (IAH). Jean Limo monitors your flight when you share the number, provides flat-rate pricing, and offers sedan, SUV, or Sprinter options for individuals and groups. Meet and greet is available at Terminals A, B, C, and D."
        image="/fleet/suv.jpg"
        highlight={{
          kicker: "Flight Monitoring Included",
          title: "Your Chauffeur Adjusts for Delays",
          body: "Share your flight number at booking. We track arrivals and departures so your pickup is timed correctly, whether the flight is early or delayed.",
          cta: "Get Instant Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Arrival Transfers", body: "Meet and greet available at Terminals A, B, C, and D (baggage claim)." },
          { title: "Departure Transfers", body: "Timed pickups with buffer for security and check-in." },
          { title: "Sedan & SUV", body: "Comfortable private travel for individuals and small groups." },
          { title: "Sprinter for Groups", body: "One vehicle for teams, families, or multiple passengers with luggage." },
          { title: "Greater Houston Coverage", body: "Service to Sugar Land, The Woodlands, Downtown, Galleria, and more." },
          { title: "24/7 Dispatch", body: "Available for early morning and late night flights." },
        ]}
        points={[
          "Flight monitoring when you share your flight number",
          "Meet and greet at Terminals A, B, C, and D",
          "Business Sedan, SUV, or Sprinter",
          "Flat rates on most Greater Houston trips",
          "Professional, background-checked chauffeurs",
          "Door-to-door service",
        ]}
        sections={[
          {
            heading: "Meet and Greet at IAH",
            body: "Meet and greet is available at Terminals A, B, C, and D. Your chauffeur waits inside at baggage claim with a name sign so you can find each other easily after you collect your bags. For international arrivals that process through Terminal E, meet and greet inside the terminal is not available—your chauffeur will meet you outside at the designated arrivals curb after you clear customs.",
          },
          {
            heading: "IAH Terminal Pickup Notes",
            body: "Domestic arrivals are typically at Terminals A, B, or C. International flights usually arrive at Terminal D or E and clear customs at Terminal E. We confirm your arrival terminal before pickup and adjust based on your flight details. Share your flight number so we can monitor status and terminal changes.",
          },
          {
            heading: "How IAH Transfers Work",
            body: "Book online or by phone with your flight details and addresses. We monitor the flight and confirm pickup instructions. For domestic flights, your chauffeur can meet you at baggage claim. For international arrivals via Terminal E, we coordinate a curbside pickup after customs. Your chauffeur arrives in a clean late-model vehicle ready for your destination.",
          },
          {
            heading: "Popular Routes from IAH",
            body: "Sugar Land (50–60 min), Downtown (25–40 min), Galleria (25–40 min), The Woodlands (30–45 min), Katy (40–55 min), and Texas Medical Center. Exact times vary with traffic. We build realistic buffers into departure pickups and monitor arrivals so you are not left waiting.",
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
            q: "Where is meet and greet available at IAH?",
            a: "Meet and greet is available at Terminals A, B, C, and D. Your chauffeur waits at baggage claim with a name sign. For international arrivals that exit through Terminal E, meet and greet inside the terminal is not offered—we meet you curbside after customs.",
          },
          {
            q: "Can I book a Sprinter from IAH?",
            a: "Yes. Sprinter vans are available for group arrivals and departures.",
          },
          {
            q: "How much does IAH transportation cost?",
            a: "Rates are flat and based on distance. Get an instant quote online.",
          },
          {
            q: "What if my flight is delayed?",
            a: "We monitor flights. If you share your flight number, we adjust pickup timing automatically for delays or early arrivals.",
          },
        ]}
      />
    </>
  );
}
