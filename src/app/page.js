import Image from "next/image";
import { HeroSection,CategorySection,BestSellingSection } from "@/components";
export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellingSection />
    </>
  );
}
