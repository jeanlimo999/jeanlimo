import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Partners | Join Jean Limo",
  description:
    "Join the Jean Limo affiliate network. Licensed black car and chauffeur companies can partner for farm-out work in Houston, New York, and beyond.",
  alternates: {
    canonical: "https://jeanlimo.com/partners",
  },
  openGraph: {
    title: "Affiliate Partners | Jean Limo",
    description: "Partner with Jean Limo for farm-out black car and chauffeur work.",
    url: "https://jeanlimo.com/partners",
  },
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-yellow-600/20">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <a href="/" className="font-serif tracking-wide text-yellow-400">
            JEAN LIMO
          </a>
          <a href="/#quote" className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">
            Book now
          </a>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">Affiliate network</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">Join Jean Limo</h1>
        <p className="mt-5 text-lg text-zinc-300">
          For licensed black car and chauffeur companies in New York, New Jersey, Houston, or any city.
          You run the trip. Jean Limo keeps the booking and pays your farm-out rate after the job.
          Applying does not approve you.
        </p>
        <ul className="mt-8 space-y-3 text-zinc-300">
          <li className="flex gap-2"><span className="text-yellow-500">✓</span> Commercial insurance, usually $1 million</li>
          <li className="flex gap-2"><span className="text-yellow-500">✓</span> Local license for your city</li>
          <li className="flex gap-2"><span className="text-yellow-500">✓</span> Sedan, SUV, or Sprinter</li>
          <li className="flex gap-2"><span className="text-yellow-500">✓</span> A phone that is answered for the trip</li>
        </ul>
        <div className="mt-10">
          <a href="mailto:partners@jeanlimo.com" className="rounded bg-yellow-500 px-6 py-3 font-semibold text-zinc-900">
            Apply
          </a>
        </div>
      </main>
    </div>
  );
}
