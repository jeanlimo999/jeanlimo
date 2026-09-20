export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-zinc-900 border border-yellow-600/20 rounded-2xl p-8">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="font-serif text-3xl text-yellow-500 mb-3">Booking Confirmed</h1>
        <p className="text-zinc-400 mb-6">
          Thank you! Your payment was successful. Jean Limo will contact you shortly to confirm your chauffeur and pickup details.
        </p>
        <p className="text-sm text-zinc-500 mb-8">
          Questions? Call or text Jeannie at{" "}
          <a href="tel:+12819170929" className="text-yellow-500">281-917-0929</a>
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
