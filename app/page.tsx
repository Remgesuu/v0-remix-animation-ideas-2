import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { ValueProps } from "@/components/landing/ValueProps";
import { TerminalShowcase } from "@/components/landing/TerminalShowcase";
import { Portfolio } from "@/components/landing/Portfolio";
import { Curriculum } from "@/components/landing/Curriculum";
import { Mentor } from "@/components/landing/Mentor";
import { SalaryGrowth } from "@/components/landing/SalaryGrowth";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ValueProps />
      <TerminalShowcase />
      <Portfolio />
      <Curriculum />
      <Mentor />
      <SalaryGrowth />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
