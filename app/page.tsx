import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import AboutTriIndia from "@/components/home/AboutTriIndia";
import FeaturedStays from "@/components/home/FeaturedStays";
import DelhiMap from "@/components/home/DelhiMap";
import WhyTriIndia from "@/components/home/WhyTriIndia";
import PortfolioMarquee from "@/components/home/PortfolioMarquee";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased" style={{ position: "relative", zIndex: 101 }}>
      <Header />
      <main>
        <Hero />
        <AboutTriIndia />
        <FeaturedStays />
        <DelhiMap />
        <WhyTriIndia />
        <PortfolioMarquee />
      </main>
      <Footer />
    </div>
  );
}
