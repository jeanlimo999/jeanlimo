import QuoteWidget from "@/components/QuoteWidget";

export default function Home() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-yellow-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-yellow-500 flex items-center justify-center font-serif text-yellow-400 text-xl font-bold">
                J
              </div>
              <div>
                <div className="font-serif text-xl tracking-wide text-yellow-400">JEAN LIMO</div>
                <div className="text-[10px] tracking-[0.2em] text-zinc-400 uppercase">LLC · Houston</div>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#services" className="hover:text-yellow-400 transition">Services</a>
              <a href="#fleet" className="hover:text-yellow-400 transition">Fleet & Pricing</a>
              <a href="#quote" className="hover:text-yellow-400 transition">Get Quote</a>
              <a href="#contact" className="hover:text-yellow-400 transition">Contact</a>
              <a href="https://maps.app.goo.gl/aDG8UD4nBddGKKmk6" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">Reviews</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/account" className="text-xs sm:text-sm text-zinc-300 hover:text-yellow-400 px-2 whitespace-nowrap">
                My trips
              </a>
              <a
                href="#quote"
                className="px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold text-sm rounded transition"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex items-start pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <p className="text-yellow-500 tracking-[0.25em] text-xs uppercase mb-4">
                Private Chauffeur Service · Houston, TX
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
                Houston Black Car, Airport & Private Chauffeur Service
              </h1>
              <p className="text-zinc-300 text-lg max-w-lg mb-8">
                Jean Limo LLC provides private chauffeur, black car, SUV and Sprinter transportation throughout Greater Houston. We serve IAH and Hobby Airport, Downtown Houston, Sugar Land, Galveston cruise terminals, corporate travel, hourly service and special events.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-500">✓</span> Licensed & Insured
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-500">✓</span> 24/7 Dispatch
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <span className="text-yellow-500">✓</span> Flat Rates
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#quote"
                  className="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded transition"
                >
                  Get Instant Quote
                </a>
                <a
                  href="tel:+12819170929"
                  className="px-8 py-3.5 border border-yellow-500/50 hover:border-yellow-400 text-yellow-400 font-semibold rounded transition"
                >
                  Call Jeannie
                </a>
              </div>
            </div>

            <div id="quote" className="lg:-mt-2">
              <QuoteWidget />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-yellow-600/10 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-yellow-500 font-serif text-lg mb-1">On-time</div>
            <div className="text-xs text-zinc-400">Confirmed itinerary</div>
          </div>
          <div>
            <div className="text-yellow-500 font-serif text-lg mb-1">One clear price</div>
            <div className="text-xs text-zinc-400">Gratuity & fuel included</div>
          </div>
          <div>
            <div className="text-yellow-500 font-serif text-lg mb-1">Professional</div>
            <div className="text-xs text-zinc-400">Background-checked chauffeurs</div>
          </div>
          <div>
            <div className="text-yellow-500 font-serif text-lg mb-1">Personal service</div>
            <div className="text-xs text-zinc-400">Dispatch confirms every ride</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Our Services</p>
            <h2 className="font-serif text-3xl md:text-4xl">Private transportation for every Houston journey</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "✈️", title: "Airport Transfers", desc: "IAH & Hobby door-to-door. Flight monitoring available. Meet & greet options." },
              { icon: "🚢", title: "Galveston Cruise", desc: "Timed transfers to the Port of Galveston with luggage assistance." },
              { icon: "🏢", title: "Corporate & Executive", desc: "Discreet, reliable service for meetings, roadshows and client travel." },
              { icon: "⏱️", title: "Hourly Chauffeur", desc: "As-directed service. 2-hour minimum. Unlimited stops in Greater Houston." },
              { icon: "💍", title: "Weddings & Events", desc: "Polished arrivals for weddings, galas, concerts and special nights." },
              { icon: "🛣️", title: "Long Distance", desc: "Houston to Austin, Dallas, San Antonio and beyond — simple per-mile pricing." },
            ].map((s) => (
              <div key={s.title} className="bg-zinc-900 border border-yellow-600/10 rounded-xl p-6 hover:border-yellow-600/30 transition">
                <div className="text-yellow-500 text-2xl mb-3">{s.icon}</div>
                <h3 className="font-serif text-xl mb-2">{s.title}</h3>
                <p className="text-zinc-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TABLE */}
      <section id="fleet" className="py-20 md:py-28 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Transparent Pricing</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Know your fare before you book</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Flat per-trip rates within Greater Houston. Distances measured by best driving route. Gratuity and fuel included.
            </p>
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
                  ["0 – 10 mi", 110, 130, 300],
                  ["10 – 20 mi", 120, 145, 340],
                  ["20 – 30 mi", 130, 160, 380],
                  ["30 – 40 mi", 155, 180, 420],
                  ["40 – 50 mi", 165, 195, 460],
                  ["50 – 60 mi", 180, 215, 500],
                  ["60 – 70 mi", 195, 230, 540],
                  ["70 – 80 mi", 205, 255, 580],
                  ["80 – 90 mi", 220, 275, 620],
                  ["90 – 100 mi", 235, 285, 660],
                ].map(([dist, sedan, suv, sprinter]) => (
                  <tr key={dist as string} className="border-b border-zinc-800">
                    <td className="px-4 py-3">{dist}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">${sedan}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">${suv}</td>
                    <td className="px-4 py-3 text-center text-yellow-500">${sprinter}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 font-medium">100+ mi · per mile</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$2.50</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$3.20</td>
                  <td className="px-4 py-3 text-center text-yellow-500">$7.50</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              {
                img: "/fleet/sedan.jpg",
                name: "Business Sedan",
                aka: "Standard Class",
                models: "Mercedes E-Class, BMW 5 Series, Cadillac XTS or similar",
                seats: "3 passengers",
                bags: "3 luggage",
                from: "$110",
              },
              {
                img: "/fleet/suv.jpg",
                name: "Business SUV",
                aka: "Most booked",
                models: "Chevrolet Suburban · GMC Yukon XL or similar",
                seats: "6 passengers",
                bags: "6 luggage",
                from: "$130",
              },
              {
                img: "/fleet/sprinter.jpg",
                name: "Sprinter Van",
                aka: "Group travel",
                models: "Mercedes-Benz Sprinter 2500",
                seats: "14 passengers",
                bags: "10 luggage",
                from: "$300",
              },
            ].map((v) => (
              <div key={v.name} className="bg-zinc-950 border border-yellow-600/20 rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl text-white">{v.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-yellow-500 mt-1">{v.aka}</p>
                    </div>
                    <div className="text-yellow-500 text-sm whitespace-nowrap">from {v.from}</div>
                  </div>
                  <p className="text-sm text-zinc-400 mt-3">{v.models}</p>
                  <div className="flex gap-4 mt-4 text-sm text-zinc-300">
                    <span>{v.seats}</span>
                    <span>{v.bags}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-2xl mx-auto bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 md:p-8">
            <h3 className="font-serif text-2xl text-yellow-500 text-center mb-6">Hourly Rates · As Directed</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span>Business Sedan</span>
                <span className="text-yellow-500 font-medium">$95 / hr</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span>Business SUV</span>
                <span className="text-yellow-500 font-medium">$125 / hr</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Sprinter Van</span>
                <span className="text-yellow-500 font-medium">$195 / hr</span>
              </div>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-5">
              2-hour minimum · Unlimited stops within Greater Houston
              <br />
              (includes 20 miles per hour · overage $2.50 per mile)
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Ready when you are</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Your chauffeur is a call away</h2>
          <p className="text-zinc-400 mb-10">24/7 dispatch · Instant online quotes · Greater Houston & beyond</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <a
              href="tel:+12819170929"
              className="bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-600/40 transition"
            >
              <div className="text-sm text-zinc-400 mb-1">Call or Text</div>
              <div className="text-xl text-yellow-500 font-medium">Jeannie 281-917-0929</div>
            </a>
            <a
              href="tel:+12819170085"
              className="bg-zinc-900 border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-600/40 transition"
            >
              <div className="text-sm text-zinc-400 mb-1">Call or Text</div>
              <div className="text-xl text-yellow-500 font-medium">Cash 281-917-0085</div>
            </a>
          </div>

          <a
            href="https://maps.app.goo.gl/aDG8UD4nBddGKKmk6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-10 bg-zinc-900 border border-yellow-600/30 rounded-xl px-8 py-5 hover:border-yellow-500 transition"
          >
            <div className="text-yellow-500 text-2xl font-serif">5.0 ★★★★★</div>
            <div className="text-white mt-1">Google reviews</div>
            <div className="text-sm text-zinc-400 mt-1">Read reviews or leave one on Google</div>
          </a>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
            <span>All major credit cards accepted</span>
            <span>•</span>
            <span>VISA · Mastercard · Amex · Discover</span>
          </div>
          <p className="mt-6 text-sm text-zinc-500">
            Book online at <span className="text-yellow-500">jeanlimo.com</span>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-yellow-600/10 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-serif text-yellow-500 text-lg">JEAN LIMO LLC</div>
          <div className="text-sm text-zinc-500">Houston · Airport · Cruise · Chauffeur</div>
          <div className="text-xs text-zinc-600">© 2026 Jean Limo LLC. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
