import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston to Galveston Cruise Transfer | Jean Limo",
  description:
    "Private Houston to Galveston cruise terminal transfers. Sedan, SUV, or Sprinter with luggage assistance to the Port of Galveston.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Cruise transfer"
      title="Houston to Galveston Transfers"
      intro="Start the cruise on time. Jean Limo drives Houston to the Port of Galveston with room for luggage and a schedule built around your ship’s boarding window."
      points={[
        "Hotel, home, or airport to the cruise terminal",
        "Return transfers after disembarkation",
        "SUV and Sprinter for families and groups",
        "Timed pickup so you are not rushing the pier",
      ]}
    />
  );
}
