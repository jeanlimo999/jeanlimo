import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Hobby Airport Private Car Service | Jean Limo",
  description:
    "Private car service to William P. Hobby Airport (HOU). Flight monitoring, meet and greet at baggage claim, flat rates, sedan, SUV, and Sprinter options across Greater Houston.",
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
    "Private car service to William P. Hobby Airport with flight monitoring, meet and greet, and professional chauffeurs.",
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
        intro="Private transfers to and from William P. Hobby Airport (HOU). Jean Limo monitors flights when you share the number, offers meet and greet at baggage claim, and provides sedan, SUV, or Sprinter service for individuals and groups across Greater Houston."
        image="/fleet/suv.jpg"
        highlight={{
          kicker: "Convenient South Houston Airport",
          title: "Hobby Transfers with Flight Tracking",
          body: "Share your flight number at booking. We track arrivals and departures so your chauffeur is timed correctly. Hobby is a single-terminal airport, which makes pickup straightforward.",
          cta: "Get Instant Quote",
          href: "/#quote",
        }}
        serviceCards={[
          { title: "Arrival Transfers", body: "Meet and greet available at baggage claim on the arrivals level." },
          { title: "Departure Transfers", body: "Timed drop-offs on the upper level with buffer for check-in." },
          { title: "Sedan & SUV", body: "Private travel for individuals and small groups." },
          { title: "Sprinter for Groups", body: "One vehicle for multiple passengers and luggage." },
          { title: "Popular Routes", body: "Downtown, Galleria, Medical Center, Sugar Land, Pearland, and Galveston." },
          { title: "24/7 Availability", body: "Early and late flights covered." },
        ]}
        points={[
          "Flight monitoring when you share your flight number",
          "Meet and greet at baggage claim",
          "Business Sedan, SUV, or Sprinter",
          "Flat rates on most local trips",
          "Professional chauffeurs",
          "Door-to-door service",
        ]}
        sections={[
          {
            heading: "Meet and Greet at Hobby",
            body: "Hobby Airport has one main terminal, so meet and greet is simple. Your chauffeur waits inside at baggage claim on the arrivals level with a name sign. After you collect your bags, you meet your driver and walk together to the vehicle. This avoids the curbside wait and makes arrivals smoother, especially with luggage or groups.",
          },
          {
            heading: "Hobby Airport Pickup Notes",
            body: "Arrivals are on the lower level. Domestic and international passengers clear baggage claim before exiting. Departure drop-offs are on the upper level. We confirm your airline and flight details so the chauffeur knows the correct side of the terminal. Share your flight number for real-time monitoring.",
          },
          {
            heading: "How Hobby Transfers Work",
            body: "Book online or by phone with your flight details and addresses. We monitor the flight and confirm pickup instructions. For arrivals, your chauffeur can meet you at baggage claim. For departures, we time the pickup with buffer for security and check-in. Your chauffeur arrives in a clean late-model vehicle ready for your destination.",
          },
          {
            heading: "Popular Routes from Hobby",
            body: "Downtown Houston (15–25 min), Galleria / Uptown (25–35 min), Texas Medical Center (15–25 min), Sugar Land (25–40 min), Pearland (10–20 min), Clear Lake, and Port of Galveston (45–60 min). Exact times vary with traffic. Hobby is often the closer airport for south and southwest Houston destinations.",
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
          { href: "/medical-center-car-service", label: "Medical Center" },
        ]}
        faqs={[
          {
            q: "Is meet and greet available at Hobby?",
            a: "Yes. Your chauffeur can meet you at baggage claim on the arrivals level with a name sign.",
          },
          {
            q: "Do you track flights at Hobby?",
            a: "Yes. Provide your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
          },
          {
            q: "Can I book a Sprinter from Hobby?",
            a: "Yes. Sprinter vans are available for group arrivals and departures.",
          },
          {
            q: "Is Hobby closer than IAH for Sugar Land or the Medical Center?",
            a: "Often yes. Hobby is typically shorter for Sugar Land, Pearland, the Medical Center, and Galveston. Drive times depend on traffic.",
          },
          {
            q: "Can I book a round trip?",
            a: "Yes. Book both directions in one reservation.",
          },
        ]}
      />
    </>
  );
}
