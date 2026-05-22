import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import ImageAutoSlider from "@/components/home/ImageAutoSlider";
import RoomsSection from "@/components/home/RoomsSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased" style={{ position: "relative", zIndex: 101 }}>
      <Header />
      <main>
        <Hero />
        <TrustSection />
        <ImageAutoSlider />
        <RoomsSection />
      </main>
      <Footer />
    </div>
  );
}
