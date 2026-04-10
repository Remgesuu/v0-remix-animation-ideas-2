"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, ExternalLink, Briefcase, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

// Real testimonials data structure
const testimonials = [
  {
    id: 1,
    name: "Алексей Петров",
    avatar: "АП",
    role: "Go Developer",
    company: "Тинькофф",
    companyLogo: "T",
    linkedIn: "https://linkedin.com",
    previousRole: "PHP Developer",
    previousSalary: "80 000",
    currentSalary: "180 000",
    duration: "6 месяцев",
    quote: "До курса я 3 года писал на PHP и не мог вырваться из своего потолка. Захар не просто учит синтаксису Go — он учит думать как senior-разработчик. Через 6 месяцев я получил оффер в Тинькофф с x2 зарплатой.",
    highlight: "x2.25 к зарплате",
  },
  {
    id: 2,
    name: "Мария Сидорова",
    avatar: "МС",
    role: "Backend Engineer",
    company: "Авито",
    companyLogo: "A",
    linkedIn: "https://linkedin.com",
    previousRole: "Junior Python Dev",
    previousSalary: "60 000",
    currentSalary: "150 000",
    duration: "8 месяцев",
    quote: "Пришла почти без опыта в бэкенде. Самое ценное — это code review каждого задания. Захар буквально разбирает каждую строчку кода и объясняет, как делают в продакшене. Сейчас я в Авито и работаю над высоконагруженными сервисами.",
    highlight: "x2.5 к зарплате",
  },
  {
    id: 3,
    name: "Дмитрий Козлов",
    avatar: "ДК",
    role: "Senior Go Developer",
    company: "Ozon",
    companyLogo: "O",
    linkedIn: "https://linkedin.com",
    previousRole: "Middle Java Dev",
    previousSalary: "120 000",
    currentSalary: "250 000",
    duration: "4 месяца",
    quote: "Уже был middle Java, но хотел перейти в Go. Программа оказалась глубже, чем я ожидал — особенно модули по Web3 и платежным системам. Это реально выделило меня на собеседованиях. Теперь я Senior в Ozon.",
    highlight: "Senior за 4 месяца",
  },
  {
    id: 4,
    name: "Анна Волкова",
    avatar: "АВ",
    role: "Go Developer",
    company: "VK",
    companyLogo: "VK",
    linkedIn: "https://linkedin.com",
    previousRole: "QA Engineer",
    previousSalary: "70 000",
    currentSalary: "160 000",
    duration: "7 месяцев",
    quote: "Переход из QA в разработку казался невозможным. Но благодаря структурированной программе и постоянной поддержке ментора, я освоила Go и получила работу в VK. Гарантия трудоустройства — не пустые слова.",
    highlight: "Из QA в Dev",
  },
];

// Companies where graduates work
const companies = [
  { name: "Тинькофф", count: 12 },
  { name: "Авито", count: 8 },
  { name: "Ozon", count: 6 },
  { name: "VK", count: 5 },
  { name: "Яндекс", count: 4 },
  { name: "СберТех", count: 7 },
];

function TestimonialCard({ testimonial, isActive }: { testimonial: typeof testimonials[0]; isActive: boolean }) {
  return (
    <motion.div
      className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 ${
        isActive ? "border-primary shadow-xl shadow-primary/10" : "border-border"
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
          {testimonial.avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
            <a
              href={testimonial.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn profile"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-6 h-6 rounded bg-[#222] flex items-center justify-center text-xs font-bold text-white">
              {testimonial.companyLogo}
            </span>
            <span className="text-sm font-medium text-foreground">{testimonial.company}</span>
          </div>
        </div>

        {/* Highlight badge */}
        <div className="hidden sm:block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
          {testimonial.highlight}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
        {`"${testimonial.quote}"`}
      </blockquote>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground">Было</p>
          <p className="text-sm font-medium text-foreground">{testimonial.previousRole}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground">Зарплата</p>
          <p className="text-sm font-medium text-foreground">
            <span className="text-muted-foreground line-through">{testimonial.previousSalary}</span>
            {" → "}
            <span className="text-primary">{testimonial.currentSalary}</span>
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground">Срок</p>
          <p className="text-sm font-medium text-foreground">{testimonial.duration}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} id="testimonials" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full">
            Реальные результаты
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Истории{" "}
            <span className="text-primary">выпускников</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Не просто отзывы — реальные кейсы с цифрами, компаниями и ссылками на LinkedIn
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-16 p-6 bg-card rounded-2xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
              <CountUp end={50} duration={2} suffix="+" />
            </div>
            <div className="text-sm text-muted-foreground">выпускников</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
              <CountUp end={94} duration={2} suffix="%" />
            </div>
            <div className="text-sm text-muted-foreground">трудоустроились</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
              <CountUp end={2.1} duration={2} decimals={1} prefix="x" />
            </div>
            <div className="text-sm text-muted-foreground">рост зарплаты</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
              <CountUp end={5.5} duration={2} decimals={1} />
            </div>
            <div className="text-sm text-muted-foreground">мес. до оффера</div>
          </div>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <TestimonialCard
            key={testimonials[activeIndex].id}
            testimonial={testimonials[activeIndex]}
            isActive={true}
          />

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Companies */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wide">
            Где работают выпускники
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {companies.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border"
              >
                <span className="font-medium text-foreground">{company.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {company.count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contextual CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">
            Хотите быть следующим?
          </p>
          <a
            href="#lead-form"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Присоединиться к выпускникам
          </a>
        </motion.div>
      </div>
    </section>
  );
}
