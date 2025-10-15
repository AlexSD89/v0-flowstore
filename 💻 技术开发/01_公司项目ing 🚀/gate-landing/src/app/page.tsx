import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero";
import { UsecaseSection } from "@/components/usecase-section";
import { LogoMarquee } from "@/components/logo-marquee";
import { InstallSection } from "@/components/install-section";
import { LiveDemoPanel } from "@/components/live-demo";
import { TestimonialSection } from "@/components/testimonial-section";
import { FaqSection } from "@/components/faq-section";
import { GlobalCta } from "@/components/global-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative overflow-hidden pb-20">
      <Navigation />
      <main>
        <HeroSection />
        <UsecaseSection />
        <LogoMarquee />
        <InstallSection />
        <LiveDemoPanel />
        <TestimonialSection />
        <FaqSection />
        <GlobalCta />
      </main>
      <Footer />
    </div>
  );
}
