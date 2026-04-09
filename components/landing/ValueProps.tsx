"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const values = [
  {
    number: "01",
    title: "Только практика",
    description:
      "Никаких лекций и абстрактных примеров. Пишете реальный код с первого дня. Каждое задание — шаг к готовому сервису.",
  },
  {
    number: "02",
    title: "Индивидуальный подход",
    description:
      "Персональный ментор адаптирует программу под ваш уровень и темп. Регулярные созвоны и код-ревью каждой задачи.",
  },
  {
    number: "03",
    title: "5 сервисов в портфолио",
    description:
      "Telegram-бот, платежная система, Web3 сервис, AI интеграция, Task Manager. Реальные проекты для резюме.",
  },
];

export function ValueProps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Почему это{" "}
            <span className="text-primary">работает</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Наша программа — это не курс с видеолекциями. 
            Это практическое обучение, где ваш код будет идеальным и рабочим.
          </p>
        </motion.div>

        {/* Value Cards */}
        <div className="grid gap-8 md:gap-12">
          {values.map((value, index) => (
            <motion.div
              key={value.number}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                {/* Number */}
                <span className="text-6xl md:text-8xl font-serif font-bold text-primary/10 group-hover:text-primary/20 transition-colors leading-none">
                  {value.number}
                </span>
                
                {/* Content */}
                <div className="flex-1 pt-2 md:pt-6">
                  <h3 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
