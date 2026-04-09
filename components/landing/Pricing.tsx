"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles, Shield, X, FileText, Clock, Target, AlertCircle } from "lucide-react";

const guaranteeTerms = {
  title: "Условия гарантии трудоустройства",
  subtitle: "Полная прозрачность — никаких скрытых условий",
  requirements: [
    {
      icon: Target,
      title: "Выполнение программы",
      description: "Завершение всех 5 модулей программы с успешной сдачей финальных проектов. Посещаемость не менее 80% назначенных сессий.",
    },
    {
      icon: Clock,
      title: "Сроки поиска работы",
      description: "Гарантия действует 6 месяцев после завершения программы. Этого времени достаточно для прохождения собеседований.",
    },
    {
      icon: FileText,
      title: "Активный поиск",
      description: "Отправка не менее 50 откликов на вакансии за период действия гарантии. Мы поможем составить резюме и сопроводительные письма.",
    },
    {
      icon: Shield,
      title: "Процедура возврата",
      description: "Если за 6 месяцев вы не получили оффер — возвращаем 100% стоимости обучения. Без дополнительных условий и бюрократии.",
    },
  ],
  note: "Гарантия распространяется на позиции Junior Go Developer и выше с зарплатой от 100 000 рублей в месяц.",
};

const plans = [
  {
    id: "individual",
    name: "Индивидуально",
    description: "Всё необходимое для старта в Go-разработке",
    price: "11 000",
    period: "/ мес на 3 года",
    totalPrice: "396 000",
    popular: false,
    features: [
      "Индивидуальный ментор",
      "Чат и онлайн-звонки",
      "Финальный проект — реальный SaaS",
      "Доступ в закрытое сообщество",
      "Код-ревью каждой задачи",
    ],
    hasGuarantee: false,
  },
  {
    id: "vip",
    name: "VIP",
    description: "Для тех, кто хочет гарантий трудоустройства",
    price: "17 000",
    period: "/ мес на 3 года",
    totalPrice: "612 000",
    popular: true,
    features: [
      "Все опции базового тарифа",
      "Модуль «Подготовка к собеседованию»",
      "Карьерный куратор до трудоустройства",
      "Гарантия возврата, если не найдёте работу",
      "Помощь с резюме и LinkedIn",
    ],
    hasGuarantee: true,
  },
];

// Guarantee Modal Component
function GuaranteeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-[#1a1a1a] rounded-2xl z-50 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9673A]/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#C9673A]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#F5F2ED]">{guaranteeTerms.title}</h3>
                  <p className="text-sm text-[#888]">{guaranteeTerms.subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#333] flex items-center justify-center text-[#888] hover:text-[#F5F2ED] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {guaranteeTerms.requirements.map((req, index) => (
                  <motion.div
                    key={req.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#252525] flex items-center justify-center shrink-0">
                      <req.icon className="w-5 h-5 text-[#C9673A]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F2ED] mb-1">{req.title}</h4>
                      <p className="text-sm text-[#888] leading-relaxed">{req.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-6 p-4 bg-[#252525] rounded-lg border border-[#333] flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#C9673A] shrink-0 mt-0.5" />
                <p className="text-sm text-[#AAA]">{guaranteeTerms.note}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#333] bg-[#151515]">
              <a
                href="#lead-form"
                onClick={onClose}
                className="block w-full py-3 px-6 bg-[#C9673A] text-white rounded-lg font-medium text-center hover:bg-[#E8845B] transition-colors"
              >
                Записаться на VIP-тариф
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Pricing() {
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <>
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
                className={`relative bg-[#222] rounded-2xl p-8 border ${
                  plan.popular ? "border-[#C9673A]" : "border-[#333]"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
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

                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-serif font-bold text-[#F5F2ED]">{plan.price}</span>
                    <span className="text-lg text-[#F5F2ED]">{"₽"}</span>
                    <span className="text-[#666] text-sm">{plan.period}</span>
                  </div>
                  <p className="text-xs text-[#555] mt-1">Итого: {plan.totalPrice} ₽</p>
                </div>

                <ul className="space-y-3 mb-8 mt-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={feature} className="flex items-start gap-3 text-[#AAA]">
                      <Check className="w-5 h-5 text-[#C9673A] shrink-0 mt-0.5" />
                      <span>
                        {feature}
                        {plan.hasGuarantee && featureIndex === 3 && (
                          <button
                            onClick={() => setShowGuaranteeModal(true)}
                            className="ml-2 text-[#C9673A] text-sm underline hover:no-underline"
                          >
                            (условия)
                          </button>
                        )}
                      </span>
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

      {/* Guarantee Modal */}
      <GuaranteeModal 
        isOpen={showGuaranteeModal} 
        onClose={() => setShowGuaranteeModal(false)} 
      />
    </>
  );
}
