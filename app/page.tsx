import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { ValueProps } from "@/components/landing/ValueProps";
import { StickyCTA } from "@/components/landing/StickyCTA";

import { Portfolio } from "@/components/landing/Portfolio";
import { Testimonials } from "@/components/landing/Testimonials";
import { Curriculum } from "@/components/landing/Curriculum";
import { Mentor } from "@/components/landing/Mentor";
import { Comparison } from "@/components/landing/Comparison";
import { SalaryGrowth } from "@/components/landing/SalaryGrowth";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { LeadForm } from "@/components/landing/LeadForm";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <StickyCTA />
      <Hero />
      <ValueProps />
      <Portfolio />
      <Testimonials />
      <Curriculum />
      <Mentor />
      <Comparison />
      <SalaryGrowth />
      <Pricing />
      <FAQ />
      <LeadForm />
      <FinalCTA />
      <Footer />
    </main>
  );
}
