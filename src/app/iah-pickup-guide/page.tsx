import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IAH Airport Pickup Guide | Meet and Greet & Terminals | Jean Limo",
  description:
    "IAH airport pickup guide for George Bush Intercontinental. Meet and greet at Terminals A, B, C, and D. Flight monitoring and curbside options for Terminal E international arrivals.",
  alternates: {
    canonical: "https://jeanlimo.com/iah-pickup-guide",
  },
  openGraph: {
    title: "IAH Airport Pickup Guide | Jean Limo",
    description:
      "IAH pickup guide with meet and greet details for Terminals A, B, C, and D.",
    url: "https://jeanlimo.com/iah-pickup-guide",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Guide"
      title="IAH Airport Pickup Guide"
      intro="A practical guide to pickup at George Bush Intercontinental Airport (IAH). Learn where meet and greet is available, how international arrivals work, and how to book private car service with flight monitoring."
      image="/fleet/suv.jpg"
      highlight={{
        kicker: "Meet and Greet Available",
        title: "Terminals A, B, C, and D",
        body: "Your chauffeur can meet you inside at baggage claim with a name sign. For Terminal E international arrivals, pickup is curbside after customs.",
        cta: "Book IAH Transfer",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Domestic Arrivals", body: "Meet and greet at Terminals A, B, C, and D baggage claim." },
        { title: "International Arrivals", body: "Clear customs at Terminal E, then curbside pickup." },
        { title: "Flight Monitoring", body: "Share your flight number so we adjust for delays." },
        { title: "Departures", body: "Timed pickups with buffer for security and check-in." },
        { title: "Vehicle Options", body: "Sedan, SUV, or Sprinter depending on group size." },
        { title: "Greater Houston", body: "Service to Sugar Land, Downtown, Galleria, and more." },
      ]}
      points={[
        "Meet and greet at Terminals A, B, C, and D",
        "Curbside pickup for Terminal E international arrivals",
        "Flight monitoring when you share your flight number",
        "Sedan, SUV, and Sprinter options",
        "Flat rates on most Greater Houston trips",
      ]}
      sections={[
        {
          heading: "Meet and Greet at IAH",
          body: "Meet and greet is available at Terminals A, B, C, and D. Your chauffeur waits inside at baggage claim with a name sign so you can find each other after collecting bags. This is the smoothest option for domestic arrivals. For international arrivals that exit through Terminal E, inside meet and greet is not offered. Your chauffeur meets you at the designated arrivals curb after you clear customs.",
        },
        {
          heading: "Terminal Notes",
          body: "Domestic flights typically arrive at Terminals A, B, or C. International flights usually arrive at Terminal D or E and clear customs at Terminal E. Terminal assignments can change, so share your flight number so we can confirm the correct terminal before pickup.",
        },
        {
          heading: "How to Book an IAH Transfer",
          body: "Book online or by phone with your flight number, pickup or drop-off address, and passenger count. We monitor the flight and confirm instructions. For arrivals, specify if you want meet and greet (available at A, B, C, and D). Your chauffeur arrives in a clean late-model vehicle.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Car Service" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/sugar-land-to-iah", label: "Sugar Land to IAH" },
        { href: "/galleria-car-service", label: "Galleria" },
      ]}
      faqs={[
        {
          q: "Where is meet and greet available at IAH?",
          a: "Meet and greet is available at Terminals A, B, C, and D. For Terminal E international arrivals, pickup is curbside after customs.",
        },
        {
          q: "Do you track flights?",
          a: "Yes. Share your flight number and we monitor it so your chauffeur can adjust for delays or early arrivals.",
        },
        {
          q: "Can I book a Sprinter for a group arrival?",
          a: "Yes. Sprinter vans are available for group transfers with luggage.",
        },
      ]}
    />
  );
}
