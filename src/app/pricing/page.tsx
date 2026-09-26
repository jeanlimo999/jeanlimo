import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Black Car Pricing | Jean Limo",
  description:
    "Flat-rate Houston black car, SUV, and Sprinter pricing. See sedan, SUV, and van fares before you book on jeanlimo.com.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Rates"
      title="Houston Black Car Pricing"
      intro="Jean Limo uses flat per-trip rates inside Greater Houston. Gratuity and fuel are included. Get the exact fare on the homepage quote before you pay."
      points={[
        "Business sedan from $110 inside the first distance band",
        "SUV from $130 · Sprinter from $300",
        "Hourly: sedan $95 · SUV $125 · Sprinter $195 (2-hour minimum)",
        "100+ miles billed per mile at published rates",
      ]}
    />
  );
}
