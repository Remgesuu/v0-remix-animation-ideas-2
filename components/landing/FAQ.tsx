"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Как работает рассрочка?",
    answer: "Наши партнёры дадут вам рассрочку до 36 месяцев на курс. В месяц получается примерно от 11 000 ₽. Без процентов и скрытых платежей.",
  },
  {
    question: "Нужно ли знание английского языка?",
    answer: "Нет, специальные знания английского языка не нужны. Мы сделали обучение таким, чтобы его смог пройти любой человек, независимо от знаний английского.",
  },
  {
    question: "Вы берёте всех на обучение?",
    answer: "Да! Вам не нужно иметь диплом о высшем образовании, знать английский или математику. Мы всему вас научим с нуля.",
  },
  {
    question: "А если уже есть работа в IT?",
    answer: "Тогда ты уже многое знаешь и можешь выбрать темы, где хочешь подтянуть скилы. Мы поможем тебе стать более крутым специалистом!",
  },
  {
    question: "Сколько времени нужно уделять обучению?",
    answer: "Рекомендуем выделять минимум 10-15 часов в неделю. Чем больше практики — тем быстрее результат. Программа гибкая и адаптируется под ваш график.",
  },
  {
    question: "Что если мне не подойдёт?",
    answer: "В VIP-тарифе есть гарантия возврата средств, если вы не найдёте работу. В любом случае, первые занятия помогут понять, подходит ли вам формат.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof faqs[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="faq" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Ответы на вопросы
          </h2>
          <p className="text-lg text-muted-foreground">
            Не нашли ответ? Напишите нам в Telegram
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
