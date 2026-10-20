import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston to Galveston Cruise Transfer | Jean Limo",
  description:
    "Private transfers from Houston to Port of Galveston cruise terminals. Timed pickups, luggage space, SUV and Sprinter options. Flat rates.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-to-galveston",
  },
  openGraph: {
    title: "Houston to Galveston Cruise Transfer | Jean Limo",
    description:
      "Private transfers from Houston to Port of Galveston cruise terminals. Timed pickups, luggage space, SUV and Sprinter options. Flat rates.",
    url: "https://jeanlimo.com/houston-to-galveston",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Galveston cruise"
      title="Houston to Galveston Cruise Transfer"
      intro="Private transfers from Houston-area hotels, homes, and airports to the Port of Galveston cruise terminals. Jean Limo times your pickup to the ship’s boarding window and provides vehicles with space for luggage. We also handle return transfers after disembarkation."
      points={[
        "Timed pickups based on your ship’s schedule",
        "Space for multiple suitcases",
        "SUV and Sprinter options for families and groups",
        "Flat-rate pricing",
        "Door-to-terminal service",
        "Pickups from IAH, Hobby, hotels, and homes",
      ]}
      sections={[
        {
          heading: "Common Pickup Points",
          body: "Downtown Houston hotels, Galleria area hotels, Sugar Land, Katy, IAH and Hobby Airports, and The Woodlands.",
        },
      ]}
      faqs={[
        {
          q: "How early should we leave for the cruise port?",
          a: "Share your ship’s boarding time when booking and we will suggest a pickup window with appropriate buffer.",
        },
        {
          q: "Can you pick up from both Houston airports?",
          a: "Yes. We regularly do IAH and Hobby to Galveston transfers.",
        },
        {
          q: "Do you offer group transportation?",
          a: "Yes. Our Sprinter van seats up to 14 passengers with luggage.",
        },
      ]}
    />
  );
}
