export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl text-yellow-500 mb-6">Terms & Conditions</h1>
        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
          <p>These terms govern your use of Jean Limo LLC services and the booking of private chauffeur, black car, SUV, and Sprinter transportation through jeanlimo.com.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Bookings & Payment</h2>
          <p>Quotes are provided in good faith based on the information you supply. Final rates may vary for additional stops, waiting time, or route changes. Payment is collected via Stripe at the time of booking. Cancellations made 2 or more hours before the scheduled pickup are not charged for standard rides.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Service</h2>
          <p>Jean Limo provides licensed and insured chauffeur service. We are not responsible for delays caused by traffic, weather, flight changes, or other circumstances beyond our control. Passengers are responsible for their own conduct and any damage to the vehicle.</p>

          <h2 className="text-lg text-yellow-400 font-medium">SMS / Text Messages</h2>
          <p>By checking the consent box during booking, you agree to receive text messages from Jean Limo related to your reservation, including driver-on-the-way notifications and other ride updates. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.</p>

          <h2 className="text-lg text-yellow-400 font-medium">Contact</h2>
          <p>Jean Limo LLC · Houston, TX<br />Jeannie 281-917-0929 · Cash 281-917-0085</p>
        </div>
        <a href="/" className="inline-block mt-8 text-yellow-500 hover:underline">← Back to Home</a>
      </div>
    </div>
  );
}
