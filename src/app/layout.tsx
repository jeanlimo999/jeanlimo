import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Jean Limo LLC | Premium Houston Chauffeur & Airport Service",
  description:
    "Jean Limo LLC - Premium black car, SUV & Sprinter chauffeur service in Houston. Airport transfers (IAH & Hobby), Galveston cruise, corporate, hourly & events. Flat rates. Call Jeannie 281-917-0929.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
