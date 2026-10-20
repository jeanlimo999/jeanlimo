import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Sprinter Van Service | Group Transportation",
  description:
    "Mercedes Sprinter van service in Houston for groups up to 14. Airport transfers, corporate events, and private travel with professional chauffeurs.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-sprinter-van-service",
  },
  openGraph: {
    title: "Houston Sprinter Van Service | Jean Limo",
    description:
      "Group transportation in a Mercedes Sprinter for up to 14 passengers. Airport, cruise, and event service.",
    url: "https://jeanlimo.com/houston-sprinter-van-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Group travel"
      title="Houston Sprinter Van Service"
      intro="Move the whole group in one Mercedes Sprinter instead of splitting across cars. Jean Limo chauffeurs handle airport, cruise, wedding, and corporate groups up to 14 passengers."
      points={[
        "Up to 14 passengers and luggage space",
        "Airport, cruise, wedding, and event groups",
        "Hourly as-directed or point-to-point flat rates",
        "One chauffeur, one vehicle, one confirmation",
        "Professional, background-checked drivers",
      ]}
    />
  );
}
