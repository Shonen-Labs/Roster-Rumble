// import { Footer } from "./components/footer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AppPromotionSection } from "@/components/landing-page/app-promotion-section";
import { ContactSection } from "@/components/landing-page/contact-section";
import { EasyStepsSection } from "@/components/landing-page/easy-steps-section";
import { FAQSection } from "@/components/landing-page/faq-section";
import { HeroCarousel } from "@/components/landing-page/hero-carousel";
import { StatsSection } from "@/components/landing-page/stats-section";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";
import { WinnersSection } from "@/components/landing-page/winners-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroCarousel />
        <ContactSection />
        <StatsSection />
        <WinnersSection />
        <EasyStepsSection />
        <AppPromotionSection />
        <FAQSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
