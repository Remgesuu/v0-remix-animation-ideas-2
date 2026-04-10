"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { HeroTerminal } from "./HeroTerminal";
import { FlyingGopher } from "./FlyingGopher";
import { useMousePosition } from "@/hooks/useMousePosition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { durations, easings } from "@/lib/animations";

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
  const mousePosition = useMousePosition();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Scroll-linked parallax for depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  
  // Subtle parallax transforms - terminal rises slower than content
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const terminalY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  
  const handleGoClick = useCallback(() => {
    setGoButtonClicked(true);
    setGopherVisible(true);
  }, []);

  const handleGopherClose = useCallback(() => {
    setGopherVisible(false);
  }, []);

  return (
    <>
      {/* Flying Gopher - fixed position, follows scroll + mouse */}
      <FlyingGopher isVisible={gopherVisible} mousePosition={mousePosition} onClose={handleGopherClose} />
      
      <section 
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center pt-16 pb-8 lg:pb-0 overflow-hidden bg-background"
      >
        {/* Subtle background texture */}
        <motion.div 
          className="absolute inset-0 grain" 
          style={{ opacity: useTransform(bgOpacity, (v) => v * 0.3) }}
        />
        
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
            <motion.div 
              className="text-center lg:text-left"
              style={{ y: contentY }}
            >
              {/* Eyebrow with social proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6"
              >
                <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
                  Индивидуальное менторство
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  50+ выпускников трудоустроены
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
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MagneticButton
                  as="a"
                  href="#lead-form"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  strength={0.35}
                >
                  Оставить заявку
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#curriculum"
                  className="px-8 py-4 text-foreground border border-border rounded-lg font-medium hover:bg-card hover:border-primary/30 transition-all text-center"
                  strength={0.2}
                >
                  Смотреть программу
                </MagneticButton>
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
            </motion.div>

            {/* Right side - Interactive Terminal */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: durations.slow, delay: 0.3, ease: easings.reveal }}
              style={{ y: terminalY }}
            >
              <HeroTerminal 
                onGoClick={handleGoClick} 
                showGoButton={!goButtonClicked} 
              />

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 bg-surface-dark-elevated border border-surface-dark-border rounded-lg px-3 py-2 text-xs text-text-dark-secondary shadow-lg hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
              >
                Go 1.21
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs font-medium shadow-lg hidden lg:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 }}
              >
                Production Ready
              </motion.div>
              
              {/* Gopher launch indicator */}
              {goButtonClicked && gopherVisible && (
                <motion.div
                  className="absolute right-0 -bottom-16 bg-[#00ADD8] text-[#0D0D0D] rounded-lg px-4 py-2 text-sm font-semibold shadow-lg"
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00D4AA] rounded-full animate-pulse" />
                    Gopher запущен!
                  </div>
                  <div className="text-xs opacity-70 mt-0.5">Скролль вниз</div>
                </motion.div>
              )}
              
              {/* Show gopher again button */}
              {goButtonClicked && !gopherVisible && (
                <motion.button
                  onClick={() => setGopherVisible(true)}
                  className="absolute right-0 -bottom-16 bg-[#00ADD8] text-[#0D0D0D] rounded-lg px-4 py-2 text-sm font-semibold shadow-lg hover:bg-[#00ADD8]/90 active:scale-95 transition-all"
                  initial={{ opacity: 0, y: -10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🐹</span>
                    Вернуть Gopher
                  </div>
                </motion.button>
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
