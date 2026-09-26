import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IAH Airport Car Service Houston | Jean Limo",
  description:
    "Private car service to George Bush Intercontinental Airport (IAH). Flat-rate sedan, SUV, and Sprinter transfers with flight tracking.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="IAH airport"
      title="IAH Airport Car Service"
      intro="Book a private chauffeur to or from George Bush Intercontinental Airport. Jean Limo monitors flights when you share your number and meets you at arrivals or your hotel."
      points={[
        "Door-to-door IAH pickup and drop-off",
        "Sedan, SUV, or Sprinter",
        "Meet and greet available",
        "Flat-rate pricing from the online quote",
      ]}
    />
  );
}
