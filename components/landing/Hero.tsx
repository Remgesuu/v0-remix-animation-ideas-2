"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatedGopher } from "./AnimatedGopher";

interface HeroProps {
  isGopherTriggered?: boolean;
}

export function Hero({ isGopherTriggered = false }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-background">
      {/* Subtle background texture */}
      <div className="absolute inset-0 grain opacity-30" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 103, 58, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(201, 103, 58, 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Decorative blurs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#7DD3CA]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
                Индивидуальное менторство
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground mb-6 text-balance leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-primary">GOLANG.</span>{" "}
              С нуля до продакшена
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 text-pretty leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Индивидуальное менторство по созданию Golang сервисов. 
              Только практика — 5 реальных проектов в портфолио.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a
                href="#lead-form"
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Оставить заявку
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#terminal-demo"
                className="px-8 py-4 text-foreground border border-border rounded-lg font-medium hover:bg-card hover:border-primary/30 transition-all"
              >
                Смотреть демо
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-serif font-bold text-primary">5</div>
                <div className="text-sm text-muted-foreground">реальных проектов</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-serif font-bold text-primary">120+</div>
                <div className="text-sm text-muted-foreground">практических заданий</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-serif font-bold text-primary">1:1</div>
                <div className="text-sm text-muted-foreground">персональный ментор</div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Animated Gopher */}
          <motion.div
            className="flex items-center justify-center order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedGopher 
              isTriggered={isGopherTriggered} 
              size={280}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ 
          opacity: { delay: 1 },
          y: { duration: 1.5, repeat: Infinity }
        }}
      >
        <a href="#terminal-demo" className="block">
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </a>
      </motion.div>
    </section>
  );
}
