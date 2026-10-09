import SiteHeader from "@/components/SiteHeader";

const rows = [
  ["0 – 10 mi", "$135", "$165", "$295"],
  ["11 – 20 mi", "$155", "$185", "$330 and up"],
  ["21 – 30 mi", "$175", "$210", "$395 and up"],
  ["31 – 40 mi", "$200", "$240", "$465 and up"],
  ["41 – 50 mi", "$220", "$265", "$540 and up"],
  ["51 – 60 mi", "$240", "$295", "$605 and up"],
  ["61 – 70 mi", "$260", "$325", "$680 and up"],
  ["71 – 80 mi", "$280", "$355", "$760 and up"],
  ["81 – 90 mi", "$300", "$385", "$830 and up"],
  ["91 – 100 mi", "$320", "$410", "$905 and up"],
];

export default function LosAngelesRates() {
  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      <SiteHeader />
      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <p className="text-yellow-500 tracking-[0.2em] text-xs uppercase mb-3">Los Angeles</p>
        <h1 className="font-serif text-4xl mb-4">Los Angeles rate card</h1>
        <p className="text-zinc-400 mb-8">Used for Los Angeles and California pickups, including LAX. Prices are flat for the mile band. Miles over 100 are added to the 100-mile price. Houston and New York rates are unchanged.</p>
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
                <td className="px-4 py-3 text-center text-yellow-500">$3.95/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$4.65/mi</td>
                <td className="px-4 py-3 text-center text-yellow-500">$10.00/mi</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-300 mt-3">A 110-mile sedan is $320 + 10 × $3.95 = $359.50. Rates exclude tolls, parking, airport fees, and meet-and-greet charges.</p>
      </main>
    </div>
  );
}
