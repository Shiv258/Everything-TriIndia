import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "J Residency, Jangpura B | TriIndia Hospitality",
  description:
    "A cinematic boutique stay in Jangpura B, New Delhi with luxury rooms, in-house dining, 24/7 reception, and AI-powered arrival support.",
  openGraph: {
    title: "J Residency, Jangpura B",
    description: "Luxury rooms, direct booking offers, and concierge-led arrival support in New Delhi.",
    images: ["/jresidency/j-logo.jpeg"],
  },
};

export default function JResidencyHyphenPage() {
  return <LandingPage />;
}
