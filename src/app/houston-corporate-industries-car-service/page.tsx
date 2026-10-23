import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Corporate & Industry Car Service | Oil & Gas, Medical, Aerospace | Jean Limo",
  description:
    "Private car service for Houston industries including oil and gas, Texas Medical Center, and aerospace. Executive transportation for meetings, roadshows, and airport transfers.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-corporate-industries-car-service",
  },
  openGraph: {
    title: "Houston Corporate & Industry Car Service | Jean Limo",
    description:
      "Executive car service for oil and gas, medical, and aerospace professionals in Houston.",
    url: "https://jeanlimo.com/houston-corporate-industries-car-service",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Corporate"
      title="Houston Corporate & Industry Car Service"
      intro="Private chauffeur service for Houston’s key industries. We provide reliable executive transportation for oil and gas, Texas Medical Center, aerospace, and corporate travelers who need consistent, professional service."
      image="/fleet/suv.jpg"
      highlight={{
        kicker: "Executive Transportation",
        title: "Reliable Service for Houston Industries",
        body: "Airport transfers, multi-stop business days, and client transportation. Professional chauffeurs who understand Houston traffic and business schedules.",
        cta: "Book Corporate Transportation",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Oil & Gas", body: "Transportation for Energy Corridor meetings, client visits, and airport transfers." },
        { title: "Texas Medical Center", body: "Reliable rides for medical professionals, patients, and visitors." },
        { title: "Aerospace & NASA Area", body: "Service for Clear Lake and nearby aerospace facilities." },
        { title: "Airport Transfers", body: "IAH and Hobby pickups with flight monitoring for business travelers." },
        { title: "Hourly Service", body: "Multi-stop roadshows and client meetings with the same chauffeur." },
        { title: "Group Options", body: "SUV and Sprinter for teams traveling together." },
      ]}
      points={[
        "Professional, background-checked chauffeurs",
        "Flight monitoring for airport transfers",
        "Hourly service for multi-stop itineraries",
        "Sedan, SUV, and Sprinter options",
        "Service across Greater Houston",
        "Consistent scheduling for recurring trips",
      ]}
      sections={[
        {
          heading: "Oil and Gas Transportation",
          body: "We serve the Energy Corridor and other business districts with executive transportation for meetings, client visits, and airport connections. Share your itinerary for multi-stop days so we can assign the right vehicle and chauffeur.",
        },
        {
          heading: "Texas Medical Center",
          body: "Private transportation for medical professionals, patients, and visitors to the Texas Medical Center. Airport transfers and point-to-point rides are available. Contact us for recurring or scheduled service.",
        },
        {
          heading: "Aerospace and Clear Lake",
          body: "Service for the Clear Lake and NASA area, including airport connections and local business transportation. Hobby Airport is often the closer option for this region.",
        },
        {
          heading: "How Corporate Booking Works",
          body: "Provide your pickup and drop-off details, passenger count, and any multi-stop requirements. For recurring travel, we can coordinate consistent scheduling. Hourly service is available when you need the same vehicle throughout the day.",
        },
      ]}
      relatedLinks={[
        { href: "/energy-corridor-car-service", label: "Energy Corridor" },
        { href: "/medical-center-car-service", label: "Medical Center" },
        { href: "/clear-lake-car-service", label: "Clear Lake" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
      ]}
      faqs={[
        {
          q: "Do you provide transportation for oil and gas companies?",
          a: "Yes. We regularly handle executive and team transportation in the Energy Corridor and across Houston.",
        },
        {
          q: "Is service available for the Texas Medical Center?",
          a: "Yes. We provide airport transfers and local rides for the Medical Center area.",
        },
        {
          q: "Can you handle multi-stop business days?",
          a: "Yes. Hourly chauffeur service is available for roadshows and client meetings.",
        },
        {
          q: "Do you offer recurring corporate transportation?",
          a: "Contact us with your schedule. We can coordinate consistent service for regular travel needs.",
        },
      ]}
    />
  );
}
