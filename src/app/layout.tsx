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
    "Sugar Land car service",
    "The Woodlands black car",
    "Katy airport transportation",
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
  "@type": ["LocalBusiness", "TaxiService"],
  name: "Jean Limo LLC",
  alternateName: "Jean Limo",
  description:
    "Private chauffeur, black car, SUV and Sprinter van service based in Sugar Land serving Greater Houston. Flat-rate airport transfers to IAH and Hobby, Galveston cruise port runs, hourly chauffeur, and corporate transportation.",
  url: "https://jeanlimo.com",
  telephone: "+12819170085",
  email: "info@jeanlimo.com",
  image: "https://jeanlimo.com/og-image.jpg",
  logo: "https://jeanlimo.com/logo.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11002 Myrtle Dr",
    addressLocality: "Sugar Land",
    addressRegion: "TX",
    postalCode: "77498",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 29.6197,
    longitude: -95.6349,
  },
  areaServed: [
    { "@type": "City", name: "Houston" },
    { "@type": "City", name: "Sugar Land" },
    { "@type": "City", name: "The Woodlands" },
    { "@type": "City", name: "Katy" },
    { "@type": "City", name: "Missouri City" },
    { "@type": "City", name: "Pearland" },
    { "@type": "AdministrativeArea", name: "Greater Houston" },
  ],
  priceRange: "$$",
  paymentAccepted: "Cash, Credit Card, Debit Card",
  currenciesAccepted: "USD",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Jean Limo Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "IAH Airport Transfers",
          description: "Private black car and Sprinter service to and from George Bush Intercontinental Airport with flight monitoring.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Hobby Airport Transfers",
          description: "Door-to-door private chauffeur service to William P. Hobby Airport.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Hourly Chauffeur Service",
          description: "As-directed hourly black car, SUV, and Sprinter service in Greater Houston.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Galveston Cruise Transfers",
          description: "Timed private transfers to the Port of Galveston with luggage space.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Sprinter Van Service",
          description: "Mercedes-Benz Sprinter for groups, airport runs, and events.",
        },
      },
    ],
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
