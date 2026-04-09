"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Mentor() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#18181B] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-[#C9673A] uppercase tracking-wide">
              Ментор
            </span>
            
            <h2 className="text-3xl md:text-4xl font-serif text-[#F5F2ED] mt-4 mb-6 text-balance">
              {"Курс ведёт практик, а не теоретик"}
            </h2>

            <p className="text-[#888] text-lg mb-6 leading-relaxed">
              <span className="text-[#F5F2ED] font-medium">Захар Жихарев</span> — Go-разработчик с опытом в крупных продуктовых компаниях.
            </p>

            <p className="text-[#888] leading-relaxed mb-8">
              {"Если вы пользовались бонусами в Макдональдсе, то вы уже заочно знакомы. Именно он разрабатывал этот сервис."}
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-serif font-bold text-[#C9673A]">5+</div>
                <div className="text-sm text-[#666]">лет в Go-разработке</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-[#C9673A]">50+</div>
                <div className="text-sm text-[#666]">выпускников</div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Avatar/Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-sm mx-auto">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-[#C9673A]/10 rounded-2xl blur-xl" />
              
              {/* Avatar placeholder */}
              <div className="relative bg-[#252525] rounded-xl aspect-square flex items-center justify-center border border-[#333]">
                <span className="text-8xl font-serif font-bold text-[#C9673A]/30">ЗЖ</span>
              </div>

              {/* Quote card */}
              <motion.div
                className="absolute -bottom-6 -left-6 right-6 bg-[#252525] rounded-lg p-4 border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                <p className="text-[#888] italic text-sm">
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
