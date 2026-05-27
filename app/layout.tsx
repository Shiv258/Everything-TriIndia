import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import SplashGate from "@/components/splash/SplashGate";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://triindiahospitality.com"),
  title: "TriIndia Hospitality — A house of hotels in Delhi",
  description:
    "TriIndia Hospitality runs 15+ hotels across Delhi. Local roots, direct stays, no middlemen. Five properties around Nizamuddin Railway Station and Ashram Metro.",
  openGraph: {
    title: "TriIndia Hospitality",
    description: "A house of hotels in Delhi. Local roots. Direct stays. No middlemen.",
    images: ["/triindia-logo.jpeg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/triindia-logo.jpeg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SplashGate>{children}</SplashGate>
      </body>
    </html>
  );
}
