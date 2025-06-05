import Hero from "@/components/Hero";
import FeaturedCars from "@/components/FeaturedCars";
import WhyChooseUs from "@/components/WhyChooseUs";
import AIAssistant from "@/components/AIAssistant";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <FeaturedCars />
        <WhyChooseUs />
      </main>
      <AIAssistant />
    </div>
  );
}
