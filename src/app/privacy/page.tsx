export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-yellow-500 mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <p>Jean Limo LLC respects your privacy. This policy describes how we collect, use, and protect information when you book or use our services.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Information We Collect</h2>
          <p>When you book a ride we collect your name, phone number, email address, pickup and drop-off locations, and payment information processed by Stripe. We may also collect vehicle preference, passenger count, and any notes you provide.</p>

          <h2 className="text-lg text-yellow-400 font-medium">How We Use It</h2>
          <p>We use your information to fulfill bookings, communicate about your ride (including optional text messages when you consent), process payments, and improve our service. We do not sell your personal information.</p>

          <h2 className="text-lg text-yellow-400 font-medium">SMS Consent</h2>
          <p>Text message consent is collected separately via an unchecked checkbox on the booking form. You may opt out at any time by replying STOP. We honor opt-out requests promptly.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Data Security & Retention</h2>
          <p>We take reasonable measures to protect your information. Booking records are retained as needed for operations, accounting, and legal requirements.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Contact</h2>
          <p>Questions about this policy? Contact Jean Limo LLC at 281-917-0929 or 281-917-0085.</p>
        </div>
        <a href="/" className="inline-block mt-8 text-yellow-500 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
}
