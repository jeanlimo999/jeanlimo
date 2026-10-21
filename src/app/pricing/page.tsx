import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Black Car Pricing | Transparent Rates",
  description:
    "Transparent flat-rate pricing for Houston black car, SUV, and Sprinter service. Gratuity and fuel included. See rates by distance and hourly options.",
  alternates: {
    canonical: "https://jeanlimo.com/pricing",
  },
  openGraph: {
    title: "Houston Black Car Pricing | Jean Limo",
    description:
      "Clear flat rates for sedan, SUV, and Sprinter service in Greater Houston. Gratuity included.",
    url: "https://jeanlimo.com/pricing",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Rates"
      title="Houston Black Car Pricing"
      intro="Jean Limo uses flat per-trip rates inside Greater Houston. Gratuity and fuel are included. Get the exact fare on the homepage quote before you pay."
      points={[
        "Business sedan from $110 inside the first distance band",
        "SUV from $130 · Sprinter from $250",
        "Hourly: sedan $85 · SUV $110 · Sprinter $175 (2-hour minimum)",
        "Over 100 miles billed per mile at published rates",
      ]}
    />
  );
}
