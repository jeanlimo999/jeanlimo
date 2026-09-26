import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Hobby Airport Car Service HOU | Jean Limo",
  description:
    "Private car service to William P. Hobby Airport (HOU). Chauffeured sedan, SUV, and Sprinter transfers across Houston.",
};

export default function Page() {
  return (
    <ServicePage
      kicker="Hobby airport"
      title="HOU Airport Car Service"
      intro="Jean Limo runs private transfers to and from William P. Hobby Airport. Give us your flight details and we time the car to arrivals or your home pickup."
      points={[
        "Hobby Airport door-to-door service",
        "Useful for Southwest and domestic flights",
        "Luggage help and curb or meet-and-greet options",
        "Same flat-rate quote as the homepage",
      ]}
    />
  );
}
