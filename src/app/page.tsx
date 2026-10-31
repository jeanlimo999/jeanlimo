import type { Metadata } from "next";
import QuoteWidget from "@/components/QuoteWidget";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Houston Black Car, Airport & Private Chauffeur Service | Jean Limo",
  description:
    "Jean Limo offers private chauffeur, black car, SUV and Sprinter service in Greater Houston. Flat-rate IAH & Hobby airport transfers, Galveston cruises, hourly chauffeur, and corporate travel.",
  alternates: {
    canonical: "https://jeanlimo.com",
  },
  openGraph: {
    title: "Houston Black Car, Airport & Private Chauffeur Service | Jean Limo",
    description:
      "Private chauffeur, black car, SUV and Sprinter service in Greater Houston. Flat-rate IAH & Hobby airport transfers, Galveston cruises, and hourly chauffeur.",
    url: "https://jeanlimo.com",
  },
};

const serviceLinks = [
  { href: "/iah-airport-car-service", label: "IAH" },
  { href: "/hou-airport-car-service", label: "Hobby" },
  { href: "/houston-black-car-service", label: "Black Car" },
  { href: "/houston-to-galveston", label: "Galveston" },
  { href: "/houston-chauffeur-service", label: "Hourly" },
  { href: "/houston-sprinter-van-service", label: "Sprinter" },
  { href: "/pricing", label: "Pricing" },
];

const locationLinks = [
  { href: "/the-woodlands-car-service", label: "The Woodlands" },
  { href: "/sugar-land-car-service", label: "Sugar Land" },
  { href: "/katy-car-service", label: "Katy" },
  { href: "/river-oaks-car-service", label: "River Oaks" },
  { href: "/memorial-car-service", label: "Memorial" },
  { href: "/galleria-car-service", label: "Galleria" },
  { href: "/west-university-car-service", label: "West University" },
  { href: "/downtown-houston-car-service", label: "Downtown" },
  { href: "/tanglewood-car-service", label: "Tanglewood" },
  { href: "/energy-corridor-car-service", label: "Energy Corridor" },
  { href: "/bellaire-car-service", label: "Bellaire" },
  { href: "/houston-heights-car-service", label: "Heights" },
  { href: "/cypress-car-service", label: "Cypress" },
  { href: "/pearland-car-service", label: "Pearland" },
  { href: "/missouri-city-car-service", label: "Missouri City" },
  { href: "/clear-lake-car-service", label: "Clear Lake" },
  { href: "/kingwood-car-service", label: "Kingwood" },
  { href: "/tomball-car-service", label: "Tomball" },
  { href: "/spring-car-service", label: "Spring" },
  { href: "/humble-car-service", label: "Humble" },
  { href: "/atascocita-car-service", label: "Atascocita" },
  { href: "/league-city-car-service", label: "League City" },
  { href: "/friendswood-car-service", label: "Friendswood" },
  { href: "/richmond-car-service", label: "Richmond" },
  { href: "/montrose-car-service", label: "Montrose" },
  { href: "/medical-center-car-service", label: "Medical Center" },
  { href: "/spring-branch-car-service", label: "Spring Branch" },
  { href: "/pasadena-car-service", label: "Pasadena" },
  { href: "/baytown-car-service", label: "Baytown" },
  { href: "/stafford-car-service", label: "Stafford" },
  { href: "/fulshear-car-service", label: "Fulshear" },
  { href: "/conroe-car-service", label: "Conroe" },
  { href: "/jersey-village-car-service", label: "Jersey Village" },
  { href: "/champions-car-service", label: "Champions" },
];

const homeFaqs = [
  {
    q: "Do you offer flat rates for Houston airport transfers?",
    a: "Yes. Most Greater Houston trips have flat rates with gratuity and fuel included. Get an instant quote online.",
  },
  {
    q: "Do you monitor flights for IAH and Hobby pickups?",
    a: "Yes. Share your flight number and we track it so your chauffeur can adjust for delays or early arrivals.",
  },
  {
    q: "What vehicles are available?",
    a: "Business Sedan, Business SUV, and Mercedes-Benz Sprinter Van. Capacity depends on passengers and luggage.",
  },
  {
    q: "Is hourly chauffeur service available?",
    a: "Yes. Hourly service has a 2-hour minimum and includes unlimited stops within Greater Houston (subject to included mileage).",
  },
  {
    q: "Do you serve Galveston cruise terminals?",
    a: "Yes. We provide timed private transfers to the Port of Galveston with luggage space.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function Home() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SiteHeader />
      <section className="relative flex items-start pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-yellow-500 tracking-[0.25em] text-xs uppercase mb-4">Private Chauffeur Service · Houston, TX</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">Houston Black Car, Airport & Private Chauffeur Service</h1>
              <p className="text-zinc-300 text-lg max-w-lg mb-8">Jean Limo LLC provides private chauffeur, black car, SUV and Sprinter transportation throughout Greater Houston. We serve IAH and Hobby Airport, Downtown Houston, Sugar Land, Galveston cruise terminals, corporate travel, hourly service and special events.</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-yellow-500">✓</span> Licensed & Insured</div>
                <div className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-yellow-500">✓</span> 24/7 Dispatch</div>
                <div className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-yellow-500">✓</span> Flat Rates</div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#quote" className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded transition">Get Instant Quote</a>
                <a href="tel:+12819170929" className="px-8 py-3.5 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 font-semibold rounded transition">Call Jeannie</a>
              </div>
            </div>
            <div id="quote" className="lg:-mt-2"><QuoteWidget /></div>
          </div>
        </div>
      </section>
      <section className="border-y border-yellow-600/10 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><div className="text-yellow-500 font-serif text-lg mb-1">On-time</div><div className="text-xs text-zinc-400">Confirmed itinerary</div></div>
          <div><div className="text-yellow-500 font-serif text-lg mb-1">One clear price</div><div className="text-xs text-zinc-400">Gratuity & fuel included</div></div>
          <div><div className="text-yellow-500 font-serif text-lg mb-1">Professional</div><div className="text-xs text-zinc-400">Background-checked chauffeurs</div></div>
          <div><div className="text-yellow-500 font-serif text-lg mb-1">Personal service</div><div className="text-xs text-zinc-400">Dispatch confirms every ride</div></div>
        </div>
      </section>
      <section id="services" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Our Services</p>
            <h2 className="font-serif text-3xl md:text-4xl">Private transportation for every Houston journey</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "✈️", title: "Airport Transfers", desc: "IAH & Hobby door-to-door. Flight monitoring available. Meet & greet options.", href: "/iah-airport-car-service" },
              { icon: "🚢", title: "Galveston Cruise", desc: "Timed transfers to the Port of Galveston with luggage assistance.", href: "/houston-to-galveston" },
              { icon: "🏢", title: "Corporate & Executive", desc: "Discreet, reliable service for meetings, roadshows and client travel.", href: "/houston-black-car-service" },
              { icon: "⏱️", title: "Hourly Chauffeur", desc: "As-directed service. 2-hour minimum. Unlimited stops in Greater Houston.", href: "/houston-chauffeur-service" },
              { icon: "💍", title: "Weddings & Events", desc: "Polished arrivals for weddings, galas, concerts and special nights.", href: "/houston-black-car-service" },
              { icon: "🛣️", title: "Long Distance", desc: "Houston to Austin, Dallas, San Antonio and beyond — simple per-mile pricing.", href: "/pricing" },
            ].map((s) => (
              <Link key={s.title} href={s.href} className="bg-zinc-900 border border-yellow-600/10 rounded-xl p-6 hover:border-yellow-600/30 transition block">
                <div className="text-yellow-500 text-2xl mb-3">{s.icon}</div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="fleet" className="py-20 md:py-28 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Transparent Pricing</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Know your fare before you book</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Flat per-trip rates within Greater Houston. Distances measured by best driving route. Gratuity and fuel included.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-yellow-600/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-zinc-900">
                  <th className="px-4 py-4 text-left font-semibold">Trip Distance</th>
                  <th className="px-4 py-4 text-center font-semibold">Business Sedan</th>
                  <th className="px-4 py-4 text-center font-semibold">SUV</th>
                  <th className="px-4 py-4 text-center font-semibold">Sprinter</th>
                </tr>
              </thead>
              <tbody className="bg-zinc-900">
                {[
                  ["0 – 10 mi", "$110", "$130", "$250"],
                  ["11 – 20 mi", "$120", "$145", "$255 and up"],
                  ["21 – 30 mi", "$130", "$160", "$305 and up"],
                  ["31 – 40 mi", "$155", "$180", "$380 and up"],
                  ["41 – 50 mi", "$165", "$195", "$455 and up"],
                  ["51 – 60 mi", "$180", "$215", "$505 and up"],
                  ["61 – 70 mi", "$195", "$230", "$580 and up"],
                  ["71 – 80 mi", "$205", "$255", "$655 and up"],
                  ["81 – 90 mi", "$220", "$275", "$730 and up"],
                  ["91 – 100 mi", "$235", "$285", "$805 and up"],
                ].map(([dist, sedan, suv, sprinter]) => (
                  <tr key={dist} className="border-b border-zinc-800">
                    <td className="px-4 py-3">{dist}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">{sedan}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">{suv}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">{sprinter}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 font-medium">Over 100 mi</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$3.45/mi</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$3.80/mi</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$9.50/mi</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-500 mt-3">Sprinter pricing increases $5 per additional mile within each tier.</p>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { img: "/fleet/sedan.jpg", name: "Business Sedan", aka: "Standard Class", models: "Mercedes E-Class, BMW 5 Series, Cadillac XTS or similar", seats: "3 passengers", bags: "3 luggage", from: "$110" },
              { img: "/fleet/suv.jpg", name: "Business SUV", aka: "Most booked", models: "Chevrolet Suburban · GMC Yukon XL or similar", seats: "6 passengers", bags: "6 luggage", from: "$130" },
              { img: "/fleet/sprinter.jpg", name: "Sprinter Van", aka: "Group travel", models: "Mercedes-Benz Sprinter 2500", seats: "14 passengers", bags: "10 luggage", from: "$250" },
            ].map((v) => (
              <div key={v.name} className="bg-zinc-950 border border-yellow-600/20 rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden"><img src={v.img} alt={v.name} className="w-full h-full object-cover" /></div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl text-white">{v.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-yellow-500 mt-1">{v.aka}</p>
                    </div>
                    <div className="text-yellow-500 text-sm whitespace-nowrap">from {v.from}</div>
                  </div>
                  <p className="text-sm text-zinc-400 mt-3">{v.models}</p>
                  <div className="flex gap-4 mt-4 text-sm text-zinc-300"><span>{v.seats}</span><span>{v.bags}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 max-w-2xl mx-auto bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 md:p-8">
            <h3 className="font-serif text-2xl text-yellow-500 text-center mb-6">Hourly Rates · As Directed</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800"><span>Business Sedan</span><span className="text-yellow-500 font-medium">$85 / hr</span></div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800"><span>Business SUV</span><span className="text-yellow-500 font-medium">$110 / hr</span></div>
              <div className="flex justify-between items-center py-2"><span>Sprinter Van</span><span className="text-yellow-500 font-medium">$175 / hr</span></div>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-5">2-hour minimum · Unlimited stops within Greater Houston<br />(includes 20 miles per hour · overage $2.50 per mile)</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Serving Greater Houston</p>
            <h2 className="font-serif text-3xl md:text-4xl">Private chauffeur service across Houston</h2>
          </div>
          <div className="space-y-8 text-zinc-300 leading-relaxed">
            <p>
              Jean Limo is a Sugar Land-based private chauffeur and black car service serving Greater Houston. We specialize in flat-rate airport transfers to George Bush Intercontinental Airport (IAH) and William P. Hobby Airport (HOU), timed Galveston cruise port runs, hourly chauffeur service, and corporate transportation.
            </p>
            <p>
              Whether you need a business sedan for an executive meeting, an SUV for family travel, or a Mercedes-Benz Sprinter for a group, we provide professional, background-checked chauffeurs and clean late-model vehicles. Most local trips include gratuity and fuel in the quoted price.
            </p>
            <p>
              We serve Downtown Houston, the Galleria, Sugar Land, The Woodlands, Katy, the Energy Corridor, the Texas Medical Center, River Oaks, Memorial, and many other communities across the region. Share your flight number for airport pickups and we will monitor it so your chauffeur can adjust for delays.
            </p>
          </div>

          <div className="mt-16">
            <h2 className="font-serif text-2xl md:text-3xl text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {homeFaqs.map((f) => (
                <div key={f.q} className="border-b border-zinc-800 pb-6">
                  <h3 className="font-medium text-white">{f.q}</h3>
                  <p className="mt-2 text-zinc-400 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-28 bg-zinc-900/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Ready when you are</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Your chauffeur is a call away</h2>
          <p className="text-zinc-400 mb-10">24/7 dispatch · Instant online quotes · Greater Houston & beyond</p>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <a href="tel:+12819170929" className="bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-600/40 transition"><div className="text-sm text-zinc-400 mb-1">Call or Text</div><div className="text-xl text-yellow-500 font-medium">Jeannie 281-917-0929</div></a>
            <a href="tel:+12819170085" className="bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-600/40 transition"><div className="text-sm text-zinc-400 mb-1">Call or Text</div><div className="text-xl text-yellow-500 font-medium">Cash 281-917-0085</div></a>
          </div>
          <a href="https://maps.app.goo.gl/aDG8UD4nBddGKKmk6" target="_blank" rel="noopener noreferrer" className="inline-block mb-10 bg-zinc-900 border border-yellow-600/30 rounded-xl px-8 py-5 hover:border-yellow-500 transition">
            <div className="text-yellow-500 text-2xl font-serif">5.0 ★★★★★</div>
            <div className="text-white mt-1">Google reviews</div>
            <div className="text-sm text-zinc-400 mt-1">Read reviews or leave one on Google</div>
          </a>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400"><span>All major credit cards accepted</span><span>•</span><span>VISA · Mastercard · Amex · Discover</span></div>
          <p className="mt-6 text-sm text-zinc-500">Book online at <span className="text-yellow-500">jeanlimo.com</span></p>
        </div>
      </section>
      <footer className="border-t border-yellow-600/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="font-serif text-yellow-500 text-lg">JEAN LIMO LLC</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-yellow-500">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-yellow-600/10 pt-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Service Areas</p>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-zinc-500">
              {locationLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-yellow-500">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-xs text-zinc-600 mt-8 text-center md:text-right">© 2026 Jean Limo LLC. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
