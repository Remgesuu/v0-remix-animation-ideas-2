"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    number: "01",
    title: "Telegram Bot",
    description: "Полноценный бот с webhook, обработкой команд, FSM и интеграцией с базой данных",
    tags: ["API", "Webhooks", "PostgreSQL"],
  },
  {
    number: "02",
    title: "Web3 & Blockchain",
    description: "Сервис для работы с Ethereum: подключение к ноде, транзакции, смарт-контракты",
    tags: ["Ethereum", "JSON-RPC", "Contracts"],
  },
  {
    number: "03",
    title: "AI Service",
    description: "Backend для работы с LLM: промпты, стриминг, RAG и интеграция с OpenAI/Anthropic",
    tags: ["LLM", "Streaming", "RAG"],
  },
  {
    number: "04",
    title: "Payment System",
    description: "Платежный сервис с idempotency, управлением балансами и транзакциями",
    tags: ["Финтех", "Транзакции", "Security"],
  },
  {
    number: "05",
    title: "Task Manager",
    description: "Mini Jira с проектами, задачами, статусами и уведомлениями",
    tags: ["REST API", "Auth", "Realtime"],
  },
];

export function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="portfolio" className="py-24 md:py-32 bg-[#18181B]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2ED] mb-4 text-balance">
            5 проектов в портфолио
          </h2>
          <p className="text-lg text-[#888] text-pretty">
            Каждый проект — это реальный production-ready сервис, 
            который можно показать на собеседовании.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.number}
              className="group relative bg-[#222] rounded-xl p-6 border border-[#333] hover:border-[#C9673A]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Project Number */}
              <span className="text-5xl font-serif font-bold text-[#C9673A]/20 group-hover:text-[#C9673A]/30 transition-colors">
                {project.number}
              </span>

              {/* Content */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-[#F5F2ED] mb-2 group-hover:text-[#C9673A] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#888] text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-[#888] bg-[#333] rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
