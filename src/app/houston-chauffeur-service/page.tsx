import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Private Chauffeur Service | Jean Limo",
  description:
    "Private chauffeur service in Houston for hourly, airport, corporate, and special-event travel. Licensed drivers and flat-rate quotes.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Private chauffeur"
      title="Houston Private Chauffeur Service"
      intro="Jean Limo is a private chauffeur company, not a rideshare pool. Your driver is assigned to your trip, confirms the itinerary, and stays with the car."
      points={[
        "Hourly as-directed service with a 2-hour minimum",
        "Airport, corporate, and event chauffeurs",
        "Background-checked professional drivers",
        "Dispatch confirms every ride",
      ]}
    />
  );
}
