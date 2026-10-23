import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Houston Event Transportation | Weddings, Rodeo, Proms | Jean Limo",
  description:
    "Private event transportation in Houston for weddings, RODEOHOUSTON, quinceañeras, proms, and special occasions. Sedan, SUV, and Sprinter options with professional chauffeurs.",
  alternates: {
    canonical: "https://jeanlimo.com/houston-event-transportation",
  },
  openGraph: {
    title: "Houston Event Transportation | Jean Limo",
    description:
      "Private transportation for weddings, RODEOHOUSTON, quinceañeras, and proms.",
    url: "https://jeanlimo.com/houston-event-transportation",
  },
};

export default function Page() {
  return (
    <ServicePage
      kicker="Events"
      title="Houston Event Transportation"
      intro="Private chauffeur service for weddings, RODEOHOUSTON, quinceañeras, proms, and other special events across Greater Houston. Keep your group together and arrive on time in a sedan, SUV, or Sprinter."
      image="/fleet/sprinter.jpg"
      highlight={{
        kicker: "Arrive Together",
        title: "Event Transportation That Fits Your Timeline",
        body: "We coordinate pickups around your ceremony, reception, or event schedule. Ideal for wedding parties, groups heading to NRG, and special occasions.",
        cta: "Book Event Transportation",
        href: "/#quote",
      }}
      serviceCards={[
        { title: "Weddings", body: "Transportation for the wedding party, guests, or multi-stop ceremonies and receptions." },
        { title: "RODEOHOUSTON", body: "Group transfers to and from NRG Park. Plan ahead for event traffic." },
        { title: "Quinceañeras", body: "Private transportation for the celebration and related events." },
        { title: "Proms & Homecoming", body: "Prearranged rides for students and groups." },
        { title: "Corporate Events", body: "Team transportation to conferences, dinners, and off-site meetings." },
        { title: "Sprinter for Groups", body: "One vehicle so the party travels together." },
      ]}
      points={[
        "Professional chauffeur included",
        "Sedan, SUV, or Sprinter options",
        "Timed to your event schedule",
        "Multi-stop itineraries available",
        "Available across Greater Houston",
      ]}
      sections={[
        {
          heading: "Wedding Transportation",
          body: "We provide transportation for wedding parties and guests. Share your ceremony and reception locations, guest count, and timeline. Hourly service works well when you need the vehicle for multiple stops throughout the day.",
        },
        {
          heading: "RODEOHOUSTON and NRG Events",
          body: "Event traffic around NRG Park can be heavy. Book in advance and share your expected arrival and departure times. We plan pickups with buffer and can coordinate group transfers so everyone arrives together. Sprinters are popular for larger groups.",
        },
        {
          heading: "Quinceañeras and Proms",
          body: "Private transportation for quinceañeras, proms, and homecoming. Tell us the number of passengers, pickup locations, and event times. We confirm the right vehicle so the group fits comfortably.",
        },
        {
          heading: "How to Book Event Transportation",
          body: "Provide your event date, locations, passenger count, and any timeline details. We confirm availability and quote based on vehicle type and itinerary. Early booking is recommended for popular dates and large events.",
        },
      ]}
      relatedLinks={[
        { href: "/houston-sprinter-van-service", label: "Sprinter Van" },
        { href: "/houston-chauffeur-service", label: "Hourly Chauffeur" },
        { href: "/galleria-car-service", label: "Galleria" },
        { href: "/downtown-houston-car-service", label: "Downtown" },
        { href: "/houston-black-car-service", label: "Black Car" },
      ]}
      faqs={[
        {
          q: "Do you offer transportation for weddings?",
          a: "Yes. We provide sedan, SUV, and Sprinter service for wedding parties and guests.",
        },
        {
          q: "Can you handle group transfers to RODEOHOUSTON?",
          a: "Yes. Book in advance and share your arrival and departure times so we can plan around event traffic.",
        },
        {
          q: "Is hourly service available for events?",
          a: "Yes. Hourly chauffeur service works well for multi-stop event itineraries.",
        },
        {
          q: "How far in advance should I book?",
          a: "Earlier is better for popular dates, large groups, and major events. Contact us with your details for availability.",
        },
      ]}
    />
  );
}
