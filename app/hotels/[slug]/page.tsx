import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import HotelDetailTemplate from "@/components/hotels/HotelDetailTemplate";
import AshramViewLandingPage from "@/components/hotels/AshramViewLandingPage";
import PreetPlaceLandingPage from "@/components/hotels/PreetPlaceLandingPage";
import SamratResidencyLandingPage from "@/components/hotels/SamratResidencyLandingPage";
import Satwah29LandingPage from "@/components/hotels/Satwah29LandingPage";
import { getActiveHotels, getHotelBySlug } from "@/lib/hotels";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getActiveHotels().map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) return { title: "Hotel not found | TriIndia Hospitality" };

  return {
    title: `${hotel.name}, ${hotel.neighborhood} | TriIndia Hospitality`,
    description: hotel.tagline,
    openGraph: {
      title: `${hotel.name}, ${hotel.neighborhood}`,
      description: hotel.tagline,
      images: [hotel.heroImage],
    },
  };
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) notFound();

  switch (hotel.slug) {
    case "j-residency":
      return <LandingPage />;
    case "hotel-ashram-view":
      return <AshramViewLandingPage />;
    case "hotel-preet-place":
      return <PreetPlaceLandingPage />;
    case "hotel-samrat-residency":
      return <SamratResidencyLandingPage />;
    case "hotel-satwah-29":
      return <Satwah29LandingPage />;
    default:
      return <HotelDetailTemplate hotel={hotel} />;
  }
}
