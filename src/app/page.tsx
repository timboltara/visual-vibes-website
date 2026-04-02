import HeroSection from "@/components/home/HeroSection";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import CollectionsGrid from "@/components/home/CollectionsGrid";
import GospelSection from "@/components/home/GospelSection";
import EmailSignup from "@/components/home/EmailSignup";

export default function HomePage() {
  return (
    <div className="pt-[129px]">
      <HeroSection />
      <MarqueeTicker />
      <FeaturedProducts />
      <Testimonials />
      <CollectionsGrid />
      <GospelSection />
      <EmailSignup />
    </div>
  );
}
