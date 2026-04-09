"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Minus, Calculator, TrendingUp, Clock, DollarSign } from "lucide-react";

const comparisonData = {
  criteria: [
    { name: "Персональный подход", key: "personal" },
    { name: "Код-ревью каждого задания", key: "codeReview" },
    { name: "Реальные проекты в портфолио", key: "projects" },
    { name: "Поддержка до трудоустройства", key: "support" },
    { name: "Гибкий график", key: "flexible" },
    { name: "Карьерная поддержка", key: "career" },
    { name: "Актуальная программа", key: "relevant" },
    { name: "Средний срок до оффера", key: "timeToJob" },
    { name: "Стоимость", key: "price" },
  ],
  options: [
    {
      name: "Менторство ZaharGo",
      highlight: true,
      values: {
        personal: { value: true, note: "1:1 с ментором" },
        codeReview: { value: true, note: "Каждое задание" },
        projects: { value: true, note: "5 production-проектов" },
        support: { value: true, note: "Помощь до оффера" },
        flexible: { value: true, note: "Ваш темп" },
        career: { value: true, note: "До трудоустройства" },
        relevant: { value: true, note: "2026 стек" },
        timeToJob: { value: "5-6 мес", isText: true },
        price: { value: "от 11 000 ₽/мес", isText: true },
      },
    },
    {
      name: "Онлайн-курсы",
      highlight: false,
      values: {
        personal: { value: false, note: "Групповое обучение" },
        codeReview: { value: "partial", note: "Раз в модуль" },
        projects: { value: "partial", note: "Учебные проекты" },
        support: { value: false, note: "Нет" },
        flexible: { value: true, note: "Записи лекций" },
        career: { value: "partial", note: "Карьерный центр" },
        relevant: { value: "partial", note: "Обновляется редко" },
        timeToJob: { value: "8-12 мес", isText: true },
        price: { value: "от 5 000 ₽/мес", isText: true },
      },
    },
    {
      name: "Самообучение",
      highlight: false,
      values: {
        personal: { value: false, note: "Только вы" },
        codeReview: { value: false, note: "Нет" },
        projects: { value: "partial", note: "Pet-проекты" },
        support: { value: false, note: "Нет" },
        flexible: { value: true, note: "Полная свобода" },
        career: { value: false, note: "Нет" },
        relevant: { value: "partial", note: "Зависит от источников" },
        timeToJob: { value: "12-24+ мес", isText: true },
        price: { value: "Бесплатно*", isText: true },
      },
    },
  ],
};

function ValueCell({ value }: { value: { value: boolean | string; note?: string; isText?: boolean } }) {
  if (value.isText) {
    return (
      <span className="text-sm font-medium text-foreground">{value.value}</span>
    );
  }

  if (value.value === true) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#00D4AA]/20 flex items-center justify-center">
          <Check className="w-4 h-4 text-[#00D4AA]" />
        </div>
        {value.note && <span className="text-xs text-muted-foreground hidden sm:inline">{value.note}</span>}
      </div>
    );
  }

  if (value.value === "partial") {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Minus className="w-4 h-4 text-yellow-500" />
        </div>
        {value.note && <span className="text-xs text-muted-foreground hidden sm:inline">{value.note}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <X className="w-4 h-4 text-red-500" />
      </div>
      {value.note && <span className="text-xs text-muted-foreground hidden sm:inline">{value.note}</span>}
    </div>
  );
}

// ROI Calculator
function ROICalculator() {
  const [currentSalary, setCurrentSalary] = useState(70000);
  const [targetSalary, setTargetSalary] = useState(150000);
  
  const investmentVIP = 612000;
  const investmentBasic = 396000;
  const monthlyIncrease = targetSalary - currentSalary;
  const paybackMonthsVIP = Math.ceil(investmentVIP / monthlyIncrease);
  const paybackMonthsBasic = Math.ceil(investmentBasic / monthlyIncrease);
  const yearlyGain = monthlyIncrease * 12;
  const fiveYearGain = yearlyGain * 5 - investmentVIP;

  return (
    <motion.div
      className="bg-card rounded-2xl p-8 border border-border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Калькулятор ROI</h3>
          <p className="text-sm text-muted-foreground">Рассчитайте окупаемость обучения</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Salary */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Текущая зарплата: {currentSalary.toLocaleString()} ₽
          </label>
          <input
            type="range"
            min="30000"
            max="200000"
            step="10000"
            value={currentSalary}
            onChange={(e) => setCurrentSalary(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>30 000 ₽</span>
            <span>200 000 ₽</span>
          </div>
        </div>

        {/* Target Salary */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Целевая зарплата: {targetSalary.toLocaleString()} ₽
          </label>
          <input
            type="range"
            min="80000"
            max="400000"
            step="10000"
            value={targetSalary}
            onChange={(e) => setTargetSalary(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>80 000 ₽</span>
            <span>400 000 ₽</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <div className="text-lg font-bold text-primary whitespace-nowrap">{paybackMonthsBasic} мес</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Окупаемость (базовый)</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <div className="text-lg font-bold text-primary whitespace-nowrap">{paybackMonthsVIP} мес</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Окупаемость (VIP)</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg overflow-hidden">
            <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <div className="text-base font-bold text-foreground truncate">+{monthlyIncrease.toLocaleString()} ₽</div>
            <div className="text-[10px] text-muted-foreground leading-tight">Прирост/мес</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg overflow-hidden">
            <DollarSign className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <div className="text-base font-bold text-[#00D4AA] truncate">+{fiveYearGain.toLocaleString()} ₽</div>
            <div className="text-[10px] text-muted-foreground leading-tight">За 5 лет</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Comparison() {
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
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full">
            Сравнение
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 text-balance">
            Менторство vs{" "}
            <span className="text-primary">альтернативы</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Честное сравнение разных путей в Go-разработку. Выбирайте то, что подходит именно вам.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Comparison Table */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-card rounded-2xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-muted/50">
                <div className="p-4 border-b border-r border-border">
                  <span className="text-sm font-medium text-muted-foreground">Критерий</span>
                </div>
                {comparisonData.options.map((option) => (
                  <div
                    key={option.name}
                    className={`p-4 border-b border-r border-border last:border-r-0 text-center ${
                      option.highlight ? "bg-primary/5" : ""
                    }`}
                  >
                    <span className={`text-sm font-semibold ${option.highlight ? "text-primary" : "text-foreground"}`}>
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Table Body */}
              {comparisonData.criteria.map((criterion, index) => (
                <div
                  key={criterion.key}
                  className={`grid grid-cols-4 ${index !== comparisonData.criteria.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="p-4 border-r border-border flex items-center">
                    <span className="text-sm text-foreground">{criterion.name}</span>
                  </div>
                  {comparisonData.options.map((option) => (
                    <div
                      key={`${criterion.key}-${option.name}`}
                      className={`p-4 border-r border-border last:border-r-0 flex items-center justify-center ${
                        option.highlight ? "bg-primary/5" : ""
                      }`}
                    >
                      <ValueCell value={option.values[criterion.key as keyof typeof option.values]} />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>

            <motion.p
              className="text-xs text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              * Самообучение бесплатно по деньгам, но требует значительных временных инвестиций и самодисциплины
            </motion.p>
          </div>

          {/* ROI Calculator */}
          <div className="lg:col-span-1">
            <ROICalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
