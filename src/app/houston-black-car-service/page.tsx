import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Black Car Service | Jean Limo",
  description:
    "Private Houston black car service with sedan and SUV chauffeurs for airport, corporate, and event travel across Greater Houston.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Houston black car"
      title="Houston Black Car Service"
      intro="Jean Limo LLC provides private black car transportation throughout Greater Houston. Choose a business sedan or SUV with a professional chauffeur for airport runs, meetings, and nights out."
      points={[
        "Sedan or SUV with a dedicated chauffeur",
        "Flat rates inside Greater Houston",
        "IAH, Hobby, Downtown, Sugar Land, and The Woodlands",
        "Licensed, insured, and confirmed by dispatch",
      ]}
    />
  );
}
