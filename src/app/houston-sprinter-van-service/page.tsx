import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Sprinter Van Service | Jean Limo",
  description:
    "Mercedes Sprinter chauffeur service in Houston for groups, airport runs, and events. Up to 14 passengers with a professional driver.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Group travel"
      title="Houston Sprinter Van Service"
      intro="Move the whole group in one Mercedes Sprinter instead of splitting across cars. Jean Limo chauffeurs handle airport, cruise, wedding, and corporate groups."
      points={[
        "Up to 14 passengers and luggage space",
        "Airport, cruise, wedding, and event groups",
        "Hourly as-directed or point-to-point flat rates",
        "One chauffeur, one vehicle, one confirmation",
      ]}
    />
  );
}
