"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, Check, Code, Layers, Bot, CreditCard, Blocks } from "lucide-react";

const modules = [
  {
    number: "01",
    title: "Основы Golang",
    subtitle: "От «Hello, World!» до первого backend-сервиса",
    tasks: "32 практических задания",
    icon: Code,
    topics: [
      "Переменные, типы данных, указатели",
      "Управление потоком: if, switch, for",
      "Слайсы, map, строки и руны",
      "Функции и error-first подход",
      "Горутины, каналы, sync.Mutex",
      "Работа с файлами и JSON",
    ],
    outcomes: [
      "Писать чистый Go-код",
      "Понимать базовую конкурентность",
      "Работать с данными и файлами",
    ],
  },
  {
    number: "02",
    title: "Golang Pro",
    subtitle: "От разработчика к инженеру",
    tasks: "25 реальных заданий",
    icon: Layers,
    topics: [
      "Продвинутые структуры данных",
      "Архитектура и DI",
      "Интерфейсы и композиция",
      "Worker pool, Fan-in/Fan-out",
      "REST API и Middleware",
      "PostgreSQL и транзакции",
      "Unit и интеграционные тесты",
    ],
    outcomes: [
      "Проектировать backend-сервисы",
      "Понимать production архитектуру",
      "Писать масштабируемые системы",
    ],
  },
  {
    number: "03",
    title: "Telegram Bot",
    subtitle: "От идеи до продакшена",
    tasks: "30+ практических заданий",
    icon: Bot,
    topics: [
      "API Telegram, webhook vs polling",
      "Архитектура handlers/services/repository",
      "FSM и состояния диалогов",
      "Интеграция с базой данных",
    ],
    outcomes: [
      "Работающий бот в продакшене",
      "Чистая архитектура кода",
      "Готов к масштабированию",
    ],
  },
  {
    number: "04",
    title: "Платежная система",
    subtitle: "От транзакции до отказоустойчивого сервиса",
    tasks: "Финтех-уровень",
    icon: CreditCard,
    topics: [
      "Жизненный цикл платежа",
      "Idempotency и статусы транзакций",
      "Управление балансами",
      "Безопасность и консистентность",
    ],
    outcomes: [
      "Принимать и обрабатывать платежи",
      "Гарантировать консистентность",
      "Архитектура production-уровня",
    ],
  },
  {
    number: "05",
    title: "Web3 & Blockchain",
    subtitle: "От запроса к ноде до смарт-контрактов",
    tasks: "30+ практических заданий",
    icon: Blocks,
    topics: [
      "Блоки, транзакции, газ, RPC",
      "Подключение к Ethereum через Go",
      "Смарт-контракты и ABI",
      "Event listeners и индексирование",
      "Безопасность Web3",
    ],
    outcomes: [
      "Работать с нодой Ethereum",
      "Отправлять транзакции",
      "Интегрировать смарт-контракты",
    ],
  },
];

function ModuleCard({ module, index, isOpen, onToggle, totalModules }: { 
  module: typeof modules[0]; 
  index: number; 
  isOpen: boolean; 
  onToggle: () => void;
  totalModules: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = module.icon;
  const isLast = index === totalModules - 1;

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-0 bottom-0 w-px hidden md:block">
        {/* Vertical line */}
        {!isLast && (
          <div className="absolute top-16 bottom-0 left-0 w-px bg-gradient-to-b from-primary/50 via-border to-border" />
        )}
      </div>

      {/* Module card */}
      <div className="border border-border rounded-xl overflow-hidden bg-card md:ml-12 relative">
        {/* Timeline dot */}
        <div className="absolute -left-12 top-6 hidden md:flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border'}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <button
          onClick={onToggle}
          className="w-full flex items-start gap-4 md:gap-6 p-6 text-left hover:bg-muted/30 transition-colors"
        >
          {/* Mobile icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 md:hidden ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Module Number - Desktop */}
          <span className="text-4xl font-serif font-bold text-primary/20 hidden md:block">
            {module.number}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {module.title}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {module.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:block text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {module.tasks}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </div>
            </div>
          </div>
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 md:ml-16 grid md:grid-cols-2 gap-8">
                {/* Topics */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Что изучите
                  </h4>
                  <ul className="space-y-2">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcomes */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Результат
                  </h4>
                  <ul className="space-y-2">
                    {module.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="curriculum" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
            Программа обучения
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Программа{" "}
            <span className="text-primary">профессии</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            5 модулей, 120+ практических заданий. Каждый модуль — 
            это шаг от новичка к профессиональному Go-разработчику.
          </p>
        </motion.div>

        {/* Journey indicator */}
        <motion.div
          className="flex items-center gap-4 mb-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="px-3 py-1 bg-muted rounded-full">Новичок</span>
          <div className="flex-1 h-px bg-gradient-to-r from-muted via-primary/30 to-muted" />
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Production-ready</span>
        </motion.div>

        {/* Modules Accordion with Timeline */}
        <div className="space-y-4">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.number}
              module={module}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              totalModules={modules.length}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Начать обучение
          </a>
        </motion.div>
      </div>
    </section>
  );
}
