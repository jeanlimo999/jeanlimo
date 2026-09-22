export default function CancelPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-zinc-900 border border-yellow-600/20 rounded-2xl p-8">
        <h1 className="font-serif text-3xl text-yellow-500 mb-3">Payment Cancelled</h1>
        <p className="text-zinc-400 mb-6">
          No charge was made. You can return to the homepage and try again whenever you’re ready.
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
