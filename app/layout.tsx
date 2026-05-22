import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://triindiahospitality.com"),
  title: "TRIINDIA Hospitality – Discover India's Finest Hotels",
  description:
    "Search trusted hotels for unforgettable stays at unbeatable prices. Compare deals and book your perfect stay across India.",
  openGraph: {
    title: "TRIINDIA Hospitality",
    description: "Discover top hotels, compare deals, and book your perfect stay.",
    images: ["/triindia-logo.jpeg"],
  },
  icons: {
    icon: "/triindia-logo.jpeg",
    apple: "/triindia-logo.jpeg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
