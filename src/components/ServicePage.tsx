import Link from "next/link";

export default function ServicePage({
  kicker,
  title,
  intro,
  points,
  sections = [],
  faqs = [],
  relatedLinks = [],
  image,
  serviceCards = [],
  highlight,
}: {
  kicker: string;
  title: string;
  intro: string;
  points: string[];
  sections?: { heading: string; body: string }[];
  faqs?: { q: string; a: string }[];
  relatedLinks?: { href: string; label: string }[];
  image?: string;
  serviceCards?: { title: string; body: string }[];
  highlight?: { kicker: string; title: string; body: string; cta: string; href: string };
}) {
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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

        <div className="mt-6">
          <Link href="/#quote" className="inline-block rounded bg-yellow-500 px-6 py-3 font-semibold text-zinc-900">
            Get Instant Quote
          </Link>
        </div>

        {image && (
          <div className="mt-8">
            <img
              src={image}
              alt={`${title} — Jean Limo`}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {highlight && (
          <div className="mt-8 rounded-xl bg-zinc-900 border border-yellow-500/30 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">{highlight.kicker}</p>
            <h2 className="mt-2 font-serif text-2xl text-white">{highlight.title}</h2>
            <p className="mt-3 text-zinc-300">{highlight.body}</p>
            <Link
              href={highlight.href}
              className="mt-5 inline-block w-full rounded bg-yellow-500 px-6 py-3 text-center font-semibold text-zinc-900"
            >
              {highlight.cta}
            </Link>
          </div>
        )}

        {serviceCards.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-yellow-500">Our Transportation Services</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {serviceCards.map((card) => (
                <div key={card.title} className="rounded-lg bg-zinc-900 p-4">
                  <h3 className="font-semibold text-white">{card.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{card.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <ul className="mt-8 space-y-3 text-zinc-300">
          {points.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-yellow-500">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="font-serif text-2xl text-yellow-500">{s.heading}</h2>
            <p className="mt-3 text-zinc-300 leading-relaxed">{s.body}</p>
          </section>
        ))}

        {relatedLinks.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl text-yellow-500">Popular Service Areas</h2>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-yellow-500 hover:text-yellow-400">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-medium text-white">{f.q}</h3>
                  <p className="mt-1 text-zinc-400 text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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
