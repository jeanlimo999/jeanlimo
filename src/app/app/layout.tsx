import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jean Limo",
  description: "Book Houston black car, airport and chauffeur rides with Jean Limo.",
  applicationName: "Jean Limo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jean Limo",
  },
  formatDetection: { telephone: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
