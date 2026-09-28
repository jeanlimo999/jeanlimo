import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Jean Limo",
  description: "How Jean Limo LLC collects and uses booking information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-200">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-yellow-500">
          ← jeanlimo.com
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-yellow-400">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Jean Limo LLC · Houston, Texas · Updated September 2026</p>
        <div className="mt-8 space-y-5 text-sm leading-6 text-zinc-300">
          <p>
            Jean Limo LLC (“we”) provides private chauffeur and ground transportation. This policy covers the website, the Jean Limo booking app at jeanlimo.com/app, and related dispatch tools.
          </p>
          <h2 className="pt-2 text-lg text-white">Information we collect</h2>
          <p>
            Name, email, phone, pickup and drop-off addresses, flight number, ride date and time, vehicle choice, payment confirmation from Stripe, and trip status. If you allow location access, we may use it only to complete a booked ride.
          </p>
          <h2 className="pt-2 text-lg text-white">How we use it</h2>
          <p>
            To quote and confirm rides, assign a chauffeur, send updates, process payment, prevent fraud, and improve service. We do not sell personal information.
          </p>
          <h2 className="pt-2 text-lg text-white">Payments</h2>
          <p>
            Card charges are processed by Stripe. We do not store full card numbers on our servers.
          </p>
          <h2 className="pt-2 text-lg text-white">Sharing</h2>
          <p>
            We share trip details with the assigned chauffeur and dispatch. Providers such as Stripe, Google Maps, and our hosting or database vendors process data only to run the service.
          </p>
          <h2 className="pt-2 text-lg text-white">Retention and rights</h2>
          <p>
            Booking records are kept as needed for operations, taxes, and legal requirements. Email info@jeanlimo.com to request a copy, correction, or deletion of your information where the law allows.
          </p>
          <h2 className="pt-2 text-lg text-white">Contact</h2>
          <p>
            Jean Limo LLC · Houston, TX · info@jeanlimo.com · Jeannie 281-917-0929 · Cash 281-917-0085
          </p>
        </div>
      </div>
    </main>
  );
}
