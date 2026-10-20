import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://jeanlimo.com"),
  title: {
    default: "Houston Black Car, Airport & Private Chauffeur Service | Jean Limo",
    template: "%s | Jean Limo",
  },
  description:
    "Jean Limo offers private chauffeur, black car, airport and Sprinter service in Houston, including IAH, HOU, Sugar Land and Galveston transfers. Flat rates, gratuity included.",
  keywords: [
    "Houston black car service",
    "IAH airport car service",
    "Hobby airport car service",
    "Houston chauffeur service",
    "Houston Sprinter van",
    "Galveston cruise transfer",
    "private chauffeur Houston",
  ],
  authors: [{ name: "Jean Limo LLC" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jeanlimo.com",
    siteName: "Jean Limo",
    title: "Houston Black Car, Airport & Private Chauffeur Service | Jean Limo",
    description:
      "Private chauffeur, black car, SUV and Sprinter service in Greater Houston. Flat-rate IAH & Hobby airport transfers, Galveston cruises, and hourly chauffeur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jean Limo Houston black car and airport service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Houston Black Car & Airport Chauffeur Service | Jean Limo",
    description:
      "Private chauffeur and black car service in Houston. Flat rates for IAH, Hobby, Galveston, and hourly service.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://jeanlimo.com",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Jean Limo",
    statusBarStyle: "black-translucent",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Jean Limo LLC",
  description: "Private chauffeur, black car, and Sprinter service in Greater Houston.",
  url: "https://jeanlimo.com",
  telephone: "+12819170085",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11002 Myrtle Dr",
    addressLocality: "Sugar Land",
    addressRegion: "TX",
    postalCode: "77498",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Houston",
  },
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FSWPQKE7D9" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-FSWPQKE7D9');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {mapsKey ? (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places`}
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
