import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Sedan vs SUV vs Sprinter for Houston Airport Transfers | Jean Limo",
  description:
    "Choose the right vehicle for Houston airport transfers. Compare sedan, SUV, and Sprinter options for passenger count, luggage, and group travel to IAH and Hobby.",
  alternates: {
    canonical: "https://jeanlimo.com/sedan-suv-sprinter-guide",
  },
  openGraph: {
    title: "Sedan vs SUV vs Sprinter | Jean Limo",
    description:
      "Compare sedan, SUV, and Sprinter options for Houston airport transfers.",
    url: "https://jeanlimo.com/sedan-suv-sprinter-guide",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Guide"
      title="Sedan vs SUV vs Sprinter for Houston Airport Transfers"
      intro="Choosing the right vehicle for your Houston airport transfer depends on passenger count and luggage. Here is a practical comparison of sedan, SUV, and Sprinter options for IAH and Hobby trips."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Match the Vehicle to the Trip",
        title: "Passenger Count and Luggage Matter",
        body: "Sedans work for 1–3 passengers with light bags. SUVs fit up to 6. Sprinters are best for larger groups or trips with significant luggage.",
        cta: "Get a Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Business Sedan", body: "1–3 passengers, light luggage. Ideal for solo or couple airport runs." },
        { title: "Business SUV", body: "Up to 6 passengers. Good balance of space and comfort." },
        { title: "Sprinter Van", body: "Up to 14 passengers. Best for groups and heavy luggage." },
        { title: "Airport Transfers", body: "All options available for IAH and Hobby with flight monitoring." },
        { title: "Hourly Service", body: "Sedan, SUV, or Sprinter for multi-stop itineraries." },
        { title: "Flat Rates", body: "Clear pricing based on distance and vehicle type." },
      ]}
      points={[
        "Sedan: 1–3 passengers with light luggage",
        "SUV: up to 6 passengers",
        "Sprinter: up to 14 passengers (configuration dependent)",
        "All vehicles include a professional chauffeur",
        "Flight monitoring available for airport trips",
      ]}
      sections={[
        {
          heading: "When to Choose a Sedan",
          body: "A business sedan is the right fit for 1–3 passengers with carry-on or one checked bag each. It is comfortable for solo business travelers or couples on short trips. If you have multiple large suitcases, consider an SUV instead.",
        },
        {
          heading: "When to Choose an SUV",
          body: "An SUV comfortably seats up to 6 passengers and handles more luggage than a sedan. It is the most common choice for families, small business groups, and travelers with checked bags. For groups larger than 6 or trips with substantial luggage, a Sprinter is usually better.",
        },
        {
          heading: "When to Choose a Sprinter",
          body: "A Sprinter is the best option for groups of 7 or more, or when everyone has significant luggage. Typical capacity is up to 14 passengers depending on configuration and bags. It is ideal for corporate teams, wedding parties, family airport runs, and Galveston cruise transfers. Everyone rides together in one vehicle.",
        },
        {
          heading: "How to Decide",
          body: "Count your passengers and estimate luggage. If you are unsure, tell us the passenger count and bag details when booking. We will recommend the appropriate vehicle so everyone and their luggage fit comfortably.",
        },
      ]}
      relatedLinks={[
        { href: "/houston-sprinter-van-service", label: "Sprinter Van Service" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/houston-black-car-service", label: "Black Car Service" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        {
          q: "How many passengers fit in a sedan?",
          a: "Typically 1–3 passengers with light luggage.",
        },
        {
          q: "When should I book a Sprinter instead of an SUV?",
          a: "Choose a Sprinter for groups larger than 6 or trips with substantial luggage so everyone can travel together comfortably.",
        },
        {
          q: "Can I change the vehicle after booking?",
          a: "Contact us with updated passenger or luggage details and we will confirm the best option.",
        },
      ]}
    />
  );
}
