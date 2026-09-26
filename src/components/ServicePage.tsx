import Link from "next/link";

export default function ServicePage({
  kicker,
  title,
  intro,
  points,
}: {
  kicker: string;
  title: string;
  intro: string;
  points: string[];
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-yellow-600/20">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="font-serif tracking-wide text-yellow-400">
            JEAN LIMO
          </Link>
          <Link href="/#quote" className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">
            Book now
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">{kicker}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight">{title}</h1>
        <p className="mt-5 text-lg text-zinc-300">{intro}</p>
        <ul className="mt-8 space-y-3 text-zinc-300">
          {points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-yellow-500">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#quote" className="rounded bg-yellow-500 px-6 py-3 font-semibold text-zinc-900">
            Get instant quote
          </Link>
          <a href="tel:+12819170929" className="rounded border border-yellow-500/40 px-6 py-3 text-yellow-400">
            Call Jeannie 281-917-0929
          </a>
        </div>
        <p className="mt-10 text-sm text-zinc-500">
          <Link href="/" className="text-yellow-500">Home</Link>
          {" · "}
          <Link href="/pricing" className="text-yellow-500">Pricing</Link>
          {" · "}
          <Link href="/houston-black-car-service" className="text-yellow-500">Black car</Link>
          {" · "}
          <Link href="/iah-airport-car-service" className="text-yellow-500">IAH</Link>
          {" · "}
          <Link href="/hou-airport-car-service" className="text-yellow-500">Hobby</Link>
          {" · "}
          <Link href="/houston-to-galveston" className="text-yellow-500">Galveston</Link>
          {" · "}
          <Link href="/houston-sprinter-van-service" className="text-yellow-500">Sprinter</Link>
          {" · "}
          <Link href="/houston-chauffeur-service" className="text-yellow-500">Chauffeur</Link>
        </p>
      </main>
    </div>
  );
}
