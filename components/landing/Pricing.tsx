"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";

const plans = [
  {
    id: "individual",
    name: "Индивидуально",
    description: "Всё необходимое для старта в Go-разработке",
    price: "11 000",
    period: "/ мес на 3 года",
    popular: false,
    features: [
      "Индивидуальный ментор",
      "Чат и онлайн-звонки",
      "Финальный проект — реальный SaaS",
      "Доступ в закрытое сообщество",
      "Код-ревью каждой задачи",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    description: "Максимальная поддержка до трудоустройства",
    price: "17 000",
    period: "/ мес на 3 года",
    popular: true,
    features: [
      "Все опции базового тарифа",
      "Модуль «Подготовка к собеседованию»",
      "Карьерный куратор до трудоустройства",
      "Поддержка и помощь до трудоустройства",
      "Помощь с резюме и LinkedIn",
    ],
  },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="pricing" className="py-24 md:py-32 bg-[#18181B]">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2ED] mb-4 text-balance">
              Тарифы
            </h2>
            <p className="text-lg text-[#888]">
              Выберите формат обучения, который подходит именно вам
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <TiltCard
                  className={`relative bg-[#222] rounded-2xl p-8 border ${
                    plan.popular ? "border-[#C9673A]" : "border-[#333]"
                  }`}
                  maxTilt={8}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#C9673A] text-white text-xs font-medium rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Популярный
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-[#F5F2ED] mb-2">{plan.name}</h3>
                    <p className="text-[#888] text-sm">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-serif font-bold text-[#F5F2ED]">{plan.price}</span>
                    <span className="text-lg text-[#F5F2ED]">{"₽"}</span>
                    <span className="text-[#666] text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[#AAA]">
                        <Check className="w-5 h-5 text-[#C9673A] shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href="#lead-form"
                    className={`block w-full py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                      plan.popular
                        ? "bg-[#C9673A] text-white hover:bg-[#E8845B]"
                        : "bg-[#333] text-[#F5F2ED] hover:bg-[#444]"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Выбрать тариф
                  </motion.a>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Additional note */}
          <motion.div
            className="max-w-2xl mx-auto mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[#666] mb-2 font-medium">Меня часто спрашивают:</p>
            <h4 className="text-xl text-[#F5F2ED] mb-3">{"\"А почему у вас обучение такое дорогое?\""}</h4>
            <p className="text-[#888] text-sm leading-relaxed">
              В отличие от остальных школ мы не продаём просто лекции. В стоимость включены: 
              проверки домашних заданий, стажировка со специалистами и работа над боевыми проектами. 
              Мы единственные, кто готов на это ради качественного обучения.
            </p>
          </motion.div>
        </div>
    </section>
  );
}
