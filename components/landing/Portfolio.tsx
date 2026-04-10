"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { Bot, Blocks, Brain, CreditCard, ListTodo } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "Telegram Bot",
    description: "Полноценный бот с webhook, обработкой команд, FSM и интеграцией с базой данных",
    tags: ["API", "Webhooks", "PostgreSQL"],
    icon: Bot,
    accent: "from-blue-500/20 to-cyan-500/20",
  },
  {
    number: "02",
    title: "Web3 & Blockchain",
    description: "Сервис для работы с Ethereum: подключение к ноде, транзакции, смарт-контракты",
    tags: ["Ethereum", "JSON-RPC", "Contracts"],
    icon: Blocks,
    accent: "from-purple-500/20 to-pink-500/20",
  },
  {
    number: "03",
    title: "AI Service",
    description: "Backend для работы с LLM: промпты, стриминг, RAG и интеграция с OpenAI/Anthropic",
    tags: ["LLM", "Streaming", "RAG"],
    icon: Brain,
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    number: "04",
    title: "Payment System",
    description: "Платежный сервис с idempotency, управлением балансами и транзакциями",
    tags: ["Финтех", "Транзакции", "Security"],
    icon: CreditCard,
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    number: "05",
    title: "Task Manager",
    description: "Mini Jira с проектами, задачами, статусами и уведомлениями",
    tags: ["REST API", "Auth", "Realtime"],
    icon: ListTodo,
    accent: "from-rose-500/20 to-red-500/20",
  },
];

export function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="portfolio" className="py-24 md:py-32 dark-section relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20">
            Портфолио
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-text-dark-primary mb-4 text-balance">
            5 проектов в портфолио
          </h2>
          <p className="text-lg text-text-dark-secondary text-pretty">
            Каждый проект — это реальный production-ready сервис, 
            который можно показать на собеседовании.
          </p>
        </motion.div>

        {/* Timeline connector - visible on desktop */}
        <div className="hidden lg:block absolute left-1/2 top-64 bottom-32 w-px bg-gradient-to-b from-surface-dark-border via-primary/30 to-surface-dark-border" />

        {/* Projects Grid with Timeline Effect */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard
                  className="group relative bg-surface-dark-elevated rounded-xl p-6 border border-surface-dark-border hover:border-surface-dark-border-hover transition-all duration-300 h-full overflow-hidden"
                  maxTilt={6}
                >
                  {/* Gradient glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Header with icon and number */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-4xl font-serif font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                        {project.number}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-text-dark-primary mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-text-dark-secondary text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs font-medium text-text-dark-secondary bg-surface-dark-border/80 rounded-md backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA after portfolio */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-text-dark-secondary mb-4">
            Хотите создать такие же проекты?
          </p>
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Начать обучение
          </a>
        </motion.div>
      </div>
    </section>
  );
}
