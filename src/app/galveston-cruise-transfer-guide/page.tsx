import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Galveston Cruise Transfer Guide | Port of Galveston Car Service | Jean Limo",
  description:
    "Galveston cruise transfer guide. Private car service from Houston, Sugar Land, and airports to the Port of Galveston. Sedan, SUV, and Sprinter options with luggage space.",
  alternates: {
    canonical: "https://jeanlimo.com/galveston-cruise-transfer-guide",
  },
  openGraph: {
    title: "Galveston Cruise Transfer Guide | Jean Limo",
    description:
      "Private transfers to the Port of Galveston with luggage space for cruise passengers.",
    url: "https://jeanlimo.com/galveston-cruise-transfer-guide",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Guide"
      title="Galveston Cruise Transfer Guide"
      intro="Planning a cruise from the Port of Galveston? This guide covers private transfers from Houston, Sugar Land, and the airports, including timing tips and vehicle recommendations for luggage."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Timed Transfers",
        title: "Arrive at the Port on Schedule",
        body: "We plan pickup times with buffer for traffic so you reach the Port of Galveston with time to check in and board.",
        cta: "Book Galveston Transfer",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "From Houston", body: "Transfers from Downtown, Galleria, Sugar Land, and surrounding areas." },
        { title: "From Airports", body: "IAH and Hobby connections timed with your flight." },
        { title: "Luggage Space", body: "SUV and Sprinter options for multiple bags and groups." },
        { title: "Return Transfers", body: "Book the return from the port after your cruise." },
        { title: "Group Options", body: "Sprinter for families or groups traveling together." },
        { title: "Flat Rates", body: "Clear pricing based on distance and vehicle." },
      ]}
      points={[
        "Private transfers to and from the Port of Galveston",
        "Sedan, SUV, and Sprinter options",
        "Timed pickups with traffic buffer",
        "Space for cruise luggage",
        "Round-trip bookings available",
      ]}
      sections={[
        {
          heading: "Timing Your Transfer",
          body: "Cruise lines recommend arriving at the port several hours before departure. We build in buffer for traffic on I-45 and surrounding roads. Share your ship departure time and pickup address so we can recommend a realistic departure time. For airport connections, share your flight number so we can monitor it.",
        },
        {
          heading: "Vehicle Recommendations",
          body: "A sedan works for 1–2 passengers with limited luggage. An SUV is better for couples or small families with multiple suitcases. A Sprinter is the best choice for larger groups or when everyone has several bags. Tell us your passenger count and luggage needs so we confirm the right vehicle.",
        },
        {
          heading: "Common Pickup Areas",
          body: "We regularly handle Galveston transfers from Sugar Land, Downtown Houston, the Galleria, the Medical Center, Pearland, Clear Lake, and both Houston airports. Drive times vary with traffic. Sugar Land to Galveston is typically 60–90 minutes depending on conditions.",
        },
        {
          heading: "Booking Tips",
          body: "Book early for peak cruise days. Provide your ship name, departure time, passenger count, and luggage estimate. For returns, note your expected arrival time at the port. Round-trip reservations are available in one booking.",
        },
      ]}
      relatedLinks={[
        { href: "/houston-to-galveston", label: "Houston to Galveston" },
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/iah-airport-car-service", label: "IAH Airport" },
        { href: "/hou-airport-car-service", label: "Hobby Airport" },
        { href: "/sugar-land-car-service", label: "Sugar Land" },
      ]}
      faqs={[
        {
          q: "How long does it take from Sugar Land to Galveston?",
          a: "Typically 60–90 minutes depending on traffic. We add buffer when planning cruise transfers.",
        },
        {
          q: "Can you pick up at IAH or Hobby for a Galveston cruise?",
          a: "Yes. Share your flight number and ship departure time so we can coordinate the transfer.",
        },
        {
          q: "Do you have space for cruise luggage?",
          a: "Yes. SUV and Sprinter options provide more luggage space. Tell us your bag count when booking.",
        },
        {
          q: "Can I book a round trip?",
          a: "Yes. Book both the outbound and return transfer in one reservation.",
        },
      ]}
    />
  );
}
