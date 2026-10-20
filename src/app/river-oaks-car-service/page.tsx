import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "River Oaks Luxury Chauffeur Service | Jean Limo",
  description:
    "Private chauffeur service in River Oaks for airport transfers, special events, and executive travel. Discreet, professional drivers.",
  alternates: {
    canonical: "https://jeanlimo.com/river-oaks-car-service",
  },
  openGraph: {
    title: "River Oaks Luxury Chauffeur Service | Jean Limo",
    description:
      "Private chauffeur service in River Oaks for airport transfers and special events.",
    url: "https://jeanlimo.com/river-oaks-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="River Oaks"
      title="River Oaks Luxury Chauffeur Service"
      intro="Discreet private car and chauffeur service for River Oaks residents and visitors. Jean Limo handles IAH and Hobby airport transfers, evenings out, and executive travel with professional drivers and clear pricing."
      image="/riveroak.png"
      highlight={{
        kicker: "Premium Residential Service",
        title: "Punctual, Low-Profile Transportation",
        body: "Airport runs, dinners, galas, and private events. Typical River Oaks to IAH transfers take 30–45 minutes depending on traffic.",
        cta: "Get Instant Quote",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Airport Transfers", body: "IAH and Hobby with flight monitoring available." },
        { title: "Special Events", body: "Galas, dinners, and private occasions." },
        { title: "Hourly Chauffeur", body: "Multiple stops for shopping or meetings." },
        { title: "Sedan & SUV", body: "Comfortable private vehicles." },
        { title: "Nearby Areas", body: "Memorial, Tanglewood, West University, and Galleria." },
        { title: "24/7 Dispatch", body: "Early and late requests accepted." },
      ]}
      points={[
        "Airport transfers from River Oaks",
        "Discreet service",
        "Sedan, SUV, and Sprinter options",
        "Hourly chauffeur available",
        "Professional chauffeurs",
      ]}
      sections={[
        {
          heading: "Local Notes",
          body: "We focus on punctual service for airport runs and private events in this established neighborhood. Related areas we cover include Memorial, Tanglewood, and the Galleria.",
        },
      ]}
      relatedLinks={[
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/memorial-car-service", label: "Memorial" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/tanglewood-car-service", label: "Tanglewood" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
      ]}
      faqs={[
        { q: "Do you offer River Oaks to IAH car service?", a: "Yes. Flight monitoring is available. Typical drive time is 30–45 minutes." },
        { q: "Is the service suitable for special events?", a: "Yes. Many clients book for evenings out and private events." },
      ]}
    />
  );
}
