"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const salaries = [
  { level: "Junior", amount: "100k", note: "После обучения", color: "#C9673A" },
  { level: "Middle", amount: "300k", note: "1-2 года опыта", color: "#E8845B" },
  { level: "Senior", amount: "400k+", note: "3+ года опыта", color: "#FFB088" },
];

export function SalaryGrowth() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Заработок растёт вместе с опытом
          </h2>
          <p className="text-lg text-muted-foreground">
            Средние зарплаты Go-разработчиков в России по данным hh.ru
          </p>
        </motion.div>

        {/* Salary Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {salaries.map((salary, index) => (
            <motion.div
              key={salary.level}
              className="relative bg-card rounded-xl p-8 border border-border text-center group hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
            >
              {/* Bar visualization */}
              <div className="h-2 rounded-full bg-muted mb-6 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: salary.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${33 + index * 33}%` } : {}}
                  transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">{salary.level}</h3>
              
              <div className="flex items-baseline justify-center gap-1">
                <span 
                  className="text-4xl md:text-5xl font-serif font-bold"
                  style={{ color: salary.color }}
                >
                  {salary.amount}
                </span>
                <span className="text-lg text-muted-foreground">{"₽"}</span>
              </div>

              <p className="text-sm text-muted-foreground mt-2">{salary.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
