"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeUp, slideInLeft, slideInRight, viewportOnce, transitions, durations } from "@/lib/animations";

export function Mentor() {
  const ref = useRef(null);
  const isInView = useInView(ref, viewportOnce);

  return (
    <section ref={ref} className="py-24 md:py-32 dark-section relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              Ментор
            </span>
            
            <h2 className="text-3xl md:text-4xl font-serif text-text-dark-primary mt-4 mb-6 text-balance">
              {"Курс ведёт практик, а не теоретик"}
            </h2>

            <p className="text-text-dark-secondary text-lg mb-6 leading-relaxed">
              <span className="text-text-dark-primary font-medium">Захар Жихарев</span> — Go-разработчик с опытом в крупных продуктовых компаниях.
            </p>

            <p className="text-text-dark-secondary leading-relaxed mb-8">
              {"Если вы пользовались бонусами в Макдональдсе, то вы уже заочно знакомы. Именно он разрабатывал этот сервис."}
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-serif font-bold text-primary">5+</div>
                <div className="text-sm text-text-dark-muted">лет в Go-разработке</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-primary">50+</div>
                <div className="text-sm text-text-dark-muted">выпускников</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Avatar/Image */}
          <motion.div
            className="relative"
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="relative max-w-sm mx-auto">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-xl" />
              
              {/* Avatar placeholder */}
              <div className="relative bg-surface-dark-elevated rounded-xl aspect-square flex items-center justify-center border border-surface-dark-border">
                <span className="text-8xl font-serif font-bold text-primary/30">ЗЖ</span>
              </div>

              {/* Quote card */}
              <motion.div
                className="absolute -bottom-6 -left-6 right-6 bg-surface-dark-elevated rounded-lg p-4 border border-surface-dark-border shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: durations.normal }}
              >
                <p className="text-text-dark-secondary italic text-sm">
                  {"\"Моя цель — чтобы каждый студент получил работу\""}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
