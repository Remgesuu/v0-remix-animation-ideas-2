"use client";

import { motion, useAnimation } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const TG_LINK = "https://t.me/zaharich777";

// Animated code lines for the visual element
const CODE_LINES = [
  { text: "package main", color: "#C9673A" },
  { text: "", color: "" },
  { text: 'import "fmt"', color: "#888" },
  { text: "", color: "" },
  { text: "func main() {", color: "#C9673A" },
  { text: '    fmt.Println("Hello, Go!")', color: "#F5F2ED" },
  { text: "}", color: "#C9673A" },
];

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
  const [typedLines, setTypedLines] = useState<number>(0);
  const controls = useAnimation();

  // Animate code typing
  useEffect(() => {
    const timer = setInterval(() => {
      setTypedLines(prev => {
        if (prev >= CODE_LINES.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Trigger glow animation when code is complete
  useEffect(() => {
    if (typedLines >= CODE_LINES.length) {
      controls.start({
        boxShadow: [
          "0 0 0 rgba(201, 103, 58, 0)",
          "0 0 60px rgba(201, 103, 58, 0.4)",
          "0 0 30px rgba(201, 103, 58, 0.2)",
        ],
        transition: { duration: 1.5, ease: "easeOut" }
      });
    }
  }, [typedLines, controls]);

  return (
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
      {FLOATING_KEYWORDS.map((keyword, i) => (
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

          {/* Right side - Animated Code Visual */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="relative bg-[#1a1a1a] rounded-xl p-6 border border-[#333] shadow-2xl"
              animate={controls}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#333]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-2 text-xs text-[#666] font-mono">main.go</span>
              </div>

              {/* Code content */}
              <div className="font-mono text-sm space-y-1">
                {CODE_LINES.slice(0, typedLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <span className="w-8 text-[#444] select-none">{line.text ? i + 1 : ""}</span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </motion.div>
                ))}
                
                {/* Blinking cursor */}
                {typedLines < CODE_LINES.length && (
                  <motion.span
                    className="inline-block w-2 h-4 bg-primary ml-8"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  />
                )}
              </div>

              {/* Output section */}
              {typedLines >= CODE_LINES.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 pt-4 border-t border-[#333]"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#666]">$</span>
                    <span className="text-[#888]">go run main.go</span>
                  </div>
                  <motion.div
                    className="mt-2 text-[#00D4AA] text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Hello, Go!
                  </motion.div>
                </motion.div>
              )}

              {/* Decorative glow */}
              <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 -z-10 blur-xl opacity-50" />
            </motion.div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 bg-[#252525] border border-[#333] rounded-lg px-3 py-2 text-xs text-[#888] shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 }}
            >
              Go 1.21
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-primary text-white rounded-lg px-3 py-2 text-xs font-medium shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 }}
            >
              Production Ready
            </motion.div>
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
  );
}
