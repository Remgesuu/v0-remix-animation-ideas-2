"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Sparkles, Users, Briefcase } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

const plans = [
  {
    id: "individual",
    name: "Индивидуально",
    description: "Всё необходимое для старта в Go-разработке",
    bestFor: "Для самостоятельных",
    bestForIcon: Users,
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
    bestFor: "Для карьерного роста",
    bestForIcon: Briefcase,
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
    <section ref={ref} id="pricing" className="py-24 md:py-32 dark-section relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
            Инвестиция в карьеру
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-text-dark-primary mb-4 text-balance">
            Тарифы
          </h2>
          <p className="text-lg text-text-dark-secondary max-w-xl mx-auto">
            Выберите формат обучения, который подходит именно вам. 
            Оба тарифа включают полный доступ к программе.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const BestForIcon = plan.bestForIcon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={plan.popular ? "md:-mt-4 md:mb-4" : ""}
              >
                <TiltCard
                  className={`relative bg-surface-dark-elevated rounded-2xl p-8 border h-full ${
                    plan.popular 
                      ? "border-primary shadow-lg shadow-primary/10" 
                      : "border-surface-dark-border"
                  }`}
                  maxTilt={8}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Рекомендуем
                      </span>
                    </div>
                  )}

                  {/* Best for badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.popular ? 'bg-primary/20' : 'bg-surface-dark-border'}`}>
                      <BestForIcon className={`w-4 h-4 ${plan.popular ? 'text-primary' : 'text-text-dark-secondary'}`} />
                    </div>
                    <span className="text-sm text-text-dark-secondary">{plan.bestFor}</span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-text-dark-primary mb-2">{plan.name}</h3>
                    <p className="text-text-dark-secondary text-sm">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-surface-dark-border">
                    <span className="text-4xl font-serif font-bold text-text-dark-primary">{plan.price}</span>
                    <span className="text-lg text-text-dark-primary">{"₽"}</span>
                    <span className="text-text-dark-muted text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-start gap-3 text-text-dark-secondary"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-primary/20' : 'bg-surface-dark-border'}`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-text-dark-secondary'}`} />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <MagneticButton
                    as="a"
                    href="#lead-form"
                    className={`block w-full py-4 px-6 rounded-xl font-medium text-center transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-surface-dark-border text-text-dark-primary hover:bg-surface-dark-border/80"
                    }`}
                    strength={0.25}
                  >
                    Выбрать тариф
                  </MagneticButton>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* ROI Section */}
        <motion.div
          className="max-w-3xl mx-auto mt-16 p-8 rounded-2xl bg-surface-dark-elevated/50 border border-surface-dark-border"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <p className="text-text-dark-muted mb-2 font-medium">Меня часто спрашивают:</p>
            <h4 className="text-xl text-text-dark-primary mb-4">{"\"А почему у вас обучение такое дорогое?\""}</h4>
            <p className="text-text-dark-secondary text-sm leading-relaxed mb-6">
              В отличие от остальных школ мы не продаём просто лекции. В стоимость включены: 
              проверки домашних заданий, стажировка со специалистами и работа над боевыми проектами. 
              Мы единственные, кто готов на это ради качественного обучения.
            </p>
            
            {/* ROI highlight */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-xl border border-primary/20">
              <div className="text-left">
                <p className="text-xs text-text-dark-muted">Средний рост зарплаты выпускников</p>
                <p className="text-2xl font-serif font-bold text-primary">x2.1</p>
              </div>
              <div className="w-px h-10 bg-surface-dark-border" />
              <div className="text-left">
                <p className="text-xs text-text-dark-muted">Окупается за</p>
                <p className="text-2xl font-serif font-bold text-text-dark-primary">3-6 мес</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
