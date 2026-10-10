import SiteHeader from "@/components/SiteHeader";

const rows = [
  ["0 – 10 mi", "$120", "$145", "$270"],
  ["11 – 20 mi", "$130", "$160", "$280 and up"],
  ["21 – 30 mi", "$145", "$175", "$330 and up"],
  ["31 – 40 mi", "$170", "$200", "$410 and up"],
  ["41 – 50 mi", "$180", "$215", "$490 and up"],
  ["51 – 60 mi", "$195", "$235", "$545 and up"],
  ["61 – 70 mi", "$210", "$250", "$625 and up"],
  ["71 – 80 mi", "$220", "$275", "$715 and up"],
  ["81 – 90 mi", "$235", "$295", "$785 and up"],
  ["91 – 100 mi", "$250", "$305", "$865 and up"],
];

export default function DallasRates() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Dallas · Fort Worth</p>
        <h1 className="font-serif text-4xl mb-4">Dallas rate card</h1>
        <p className="text-zinc-400 mb-8">Greater Dallas–Fort Worth, including DFW Airport, Love Field, Uptown, Plano, Frisco, Irving, and Fort Worth. Prices are flat for the mile band. Miles over 100 are added to the 100-mile price. Houston, New York, and Los Angeles rates are unchanged.</p>
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
                <td className="px-4 py-3 text-center text-yellow-500">$3.65/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$4.00/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$9.75/mi</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-300 mt-3">A 110-mile Sprinter is $865 + 10 × $9.75 = $962.50. Sprinter pricing increases $5 per additional mile within each tier. Rates exclude tolls, parking, airport fees, and meet-and-greet charges. Additional waiting time may apply.</p>
        <div className="mt-10 max-w-2xl bg-zinc-900 border border-yellow-600/20 rounded-xl p-6">
          <h2 className="font-serif text-2xl text-yellow-500 mb-4">Hourly rates</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-zinc-800"><span>Business Sedan</span><span className="text-yellow-500">$100 / hr</span></div>
            <div className="flex justify-between py-2 border-b border-zinc-800"><span>Business SUV</span><span className="text-yellow-500">$130 / hr</span></div>
            <div className="flex justify-between py-2"><span>Sprinter Van</span><span className="text-yellow-500">$200 / hr</span></div>
          </div>
          <p className="text-xs text-zinc-500 mt-4">3-hour minimum for sedan and SUV. 4-hour minimum for Sprinter.</p>
        </div>
      </main>
    </div>
  );
}
