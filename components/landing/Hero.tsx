"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import { HeroTerminal } from "./HeroTerminal";
import { FlyingGopher } from "./FlyingGopher";

// Floating keywords
const FLOATING_KEYWORDS = [
  { text: "goroutine", x: "10%", y: "20%", delay: 0 },
  { text: "channel", x: "85%", y: "25%", delay: 0.5 },
  { text: "interface{}", x: "15%", y: "70%", delay: 1 },
  { text: "defer", x: "80%", y: "65%", delay: 1.5 },
  { text: "struct", x: "5%", y: "45%", delay: 2 },
  { text: "func()", x: "90%", y: "45%", delay: 2.5 },
];

export function Hero() {
  const [gopherVisible, setGopherVisible] = useState(false);
  const [goButtonClicked, setGoButtonClicked] = useState(false);
  
  const handleGoClick = useCallback(() => {
    setGoButtonClicked(true);
    setGopherVisible(true);
  }, []);

  return (
    <>
      {/* Flying Gopher - fixed position, follows scroll */}
      <FlyingGopher isVisible={gopherVisible} />
      
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden bg-background">
        {/* Subtle background texture */}
        <div className="absolute inset-0 grain opacity-30" />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(201, 103, 58, 0.5) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(201, 103, 58, 0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Floating keywords */}
        {FLOATING_KEYWORDS.map((keyword) => (
          <motion.span
            key={keyword.text}
            className="absolute hidden lg:block text-xs font-mono text-primary/20 select-none"
            style={{ left: keyword.x, top: keyword.y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 0.3, 0.15],
              y: [20, 0, -10, 0],
            }}
            transition={{ 
              delay: keyword.delay + 1,
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {keyword.text}
          </motion.span>
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
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
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 text-pretty leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Индивидуальное менторство по созданию Golang сервисов. 
                Только практика — 5 реальных проектов в портфолио. 
                Код, который приносит деньги.
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
                  href="#curriculum"
                  className="px-8 py-4 text-foreground border border-border rounded-lg font-medium hover:bg-card hover:border-primary/30 transition-all"
                >
                  Смотреть программу
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-16 pt-8 border-t border-border"
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

            {/* Right side - Interactive Terminal */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HeroTerminal 
                onGoClick={handleGoClick} 
                showGoButton={!goButtonClicked} 
              />

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#888] shadow-lg hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                Go 1.21
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-primary text-white rounded-lg px-3 py-2 text-xs font-medium shadow-lg hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
              >
                Production Ready
              </motion.div>
              
              {/* Gopher launch indicator */}
              {goButtonClicked && (
                <motion.div
                  className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full bg-[#00ADD8] text-[#0D0D0D] rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hidden lg:block"
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />
                    Gopher запущен!
                  </div>
                  <div className="text-xs opacity-70 mt-0.5">Скролль вниз</div>
                </motion.div>
              )}
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
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>
    </>
  );
}
