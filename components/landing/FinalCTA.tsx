"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { fadeUp, viewportOnce, transitions } from "@/lib/animations";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportOnce);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-primary/5 relative overflow-hidden grain">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6 text-balance">
            Готовы начать путь в{" "}
            <span className="text-primary">Go-разработке</span>?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Оставьте заявку на бесплатную консультацию. Обсудим ваши цели и подберём оптимальный план обучения.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              as="a"
              href="#lead-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              strength={0.35}
            >
              Оставить заявку
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href="https://t.me/zaharich777"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-lg font-medium text-foreground hover:bg-card transition-colors"
              strength={0.2}
            >
              <MessageCircle className="w-5 h-5" />
              Написать в Telegram
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
