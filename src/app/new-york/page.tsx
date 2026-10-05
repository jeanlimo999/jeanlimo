import SiteHeader from "@/components/SiteHeader";

const rows = [
  ["0 – 10 mi", "$135", "$170", "$260"],
  ["11 – 20 mi", "$175", "$220", "$320"],
  ["21 – 30 mi", "$215", "$270", "$380"],
  ["31 – 40 mi", "$255", "$320", "$440"],
  ["41 – 50 mi", "$295", "$370", "$500"],
  ["51 – 60 mi", "$335", "$420", "$560"],
  ["61 – 70 mi", "$375", "$470", "$620"],
  ["71 – 80 mi", "$415", "$520", "$680"],
  ["81 – 90 mi", "$455", "$570", "$740"],
  ["91 – 100 mi", "$495", "$620", "$800"],
];

export default function NewYorkRates() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">New York and New Jersey</p>
        <h1 className="font-serif text-4xl mb-4">New York and New Jersey rate card</h1>
        <p className="text-zinc-400 mb-8">Same card for New York and New Jersey. Prices are flat for the mile band. Houston rates are unchanged.</p>
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
              {rows.map(([dist, sedan, suv, sprinter]) => (
                <tr key={dist} className="border-b border-zinc-800">
                  <td className="px-4 py-3">{dist}</td>
                  <td className="px-4 py-3 text-center text-yellow-500">{sedan}</td>
                  <td className="px-4 py-3 text-center text-yellow-500">{suv}</td>
                  <td className="px-4 py-3 text-center text-yellow-500">{sprinter}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 font-medium">Over 100 mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$4.25/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$5.25/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$10.50/mi</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-300 mt-3">Rates exclude tolls, parking, airport fees, and meet-and-greet charges. Additional waiting time may apply.</p>
        <div className="mt-10 max-w-2xl bg-zinc-900 border border-yellow-600/20 rounded-xl p-6">
          <h2 className="font-serif text-2xl text-yellow-500 mb-4">Hourly rates</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-zinc-800"><span>Business Sedan</span><span className="text-yellow-500">$125 / hr</span></div>
            <div className="flex justify-between py-2 border-b border-zinc-800"><span>Business SUV</span><span className="text-yellow-500">$155 / hr</span></div>
            <div className="flex justify-between py-2"><span>Sprinter Van</span><span className="text-yellow-500">$225 / hr</span></div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">3-hour minimum.</p>
        </div>
      </main>
    </div>
  );
}
