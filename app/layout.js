import "./globals.css";

export const metadata = {
  title: "Jean Limo LLC · Houston",
  description: "Book a sedan with optional driver tip",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
