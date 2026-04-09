"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle, ArrowRight, Shield, Clock, Users } from "lucide-react";

const experienceLevels = [
  { value: "beginner", label: "Нет опыта в программировании" },
  { value: "other-lang", label: "Есть опыт в другом языке" },
  { value: "junior-go", label: "Junior Go-разработчик" },
  { value: "middle", label: "Middle+ разработчик" },
];

const goals = [
  { value: "first-job", label: "Найти первую работу в IT" },
  { value: "switch", label: "Перейти в Go из другого языка" },
  { value: "level-up", label: "Повысить уровень и зарплату" },
  { value: "freelance", label: "Начать фриланс/свой проект" },
];

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    experience: "",
    goal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
    }
    
    if (!formData.contact.trim()) {
      newErrors.contact = "Введите телефон или email";
    } else if (
      !formData.contact.includes("@") && 
      !/^[\d\s\-+()]+$/.test(formData.contact)
    ) {
      newErrors.contact = "Введите корректный телефон или email";
    }
    
    if (!formData.experience) {
      newErrors.experience = "Выберите ваш уровень";
    }
    
    if (!formData.goal) {
      newErrors.goal = "Выберите вашу цель";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <section ref={ref} id="lead-form" className="py-24 md:py-32 bg-[#18181B] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-medium tracking-widest uppercase text-primary bg-primary/10 rounded-full">
              Бесплатная консультация
            </span>
            
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2ED] mb-6 text-balance">
              Начните свой путь в{" "}
              <span className="text-primary">Go-разработке</span>
            </h2>

            <p className="text-[#888] text-lg mb-8 leading-relaxed">
              Оставьте заявку, и мы свяжемся с вами в течение 24 часов. 
              Обсудим ваши цели, подберём оптимальный формат обучения и ответим на все вопросы.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#AAA]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <span>Ответим в течение 24 часов</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAA]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span>Персональный разбор вашей ситуации</span>
              </div>
              <div className="flex items-center gap-3 text-[#AAA]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span>Без спама и навязчивых звонков</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-[#222] rounded-2xl p-8 border border-[#333]">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#F5F2ED] mb-2">
                        Ваше имя
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#F5F2ED] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                          errors.name ? "border-red-500" : "border-[#333]"
                        }`}
                        placeholder="Как к вам обращаться?"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Contact */}
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-[#F5F2ED] mb-2">
                        Телефон или Email
                      </label>
                      <input
                        type="text"
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#F5F2ED] placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                          errors.contact ? "border-red-500" : "border-[#333]"
                        }`}
                        placeholder="+7 (999) 123-45-67 или email@example.com"
                      />
                      {errors.contact && (
                        <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-[#F5F2ED] mb-2">
                        Ваш текущий уровень
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {experienceLevels.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => handleInputChange("experience", level.value)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                              formData.experience === level.value
                                ? "bg-primary/20 border-primary text-[#F5F2ED]"
                                : "bg-[#1a1a1a] border-[#333] text-[#888] hover:border-[#444]"
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                      {errors.experience && (
                        <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
                      )}
                    </div>

                    {/* Goal */}
                    <div>
                      <label className="block text-sm font-medium text-[#F5F2ED] mb-2">
                        Ваша цель
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {goals.map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onClick={() => handleInputChange("goal", goal.value)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all text-left ${
                              formData.goal === goal.value
                                ? "bg-primary/20 border-primary text-[#F5F2ED]"
                                : "bg-[#1a1a1a] border-[#333] text-[#888] hover:border-[#444]"
                            }`}
                          >
                            {goal.label}
                          </button>
                        ))}
                      </div>
                      {errors.goal && (
                        <p className="mt-1 text-sm text-red-500">{errors.goal}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Отправляем...
                        </>
                      ) : (
                        <>
                          Оставить заявку
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-[#666] text-center">
                      Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#00D4AA]/20 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <CheckCircle className="w-10 h-10 text-[#00D4AA]" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-serif font-semibold text-[#F5F2ED] mb-3">
                      Заявка отправлена!
                    </h3>
                    <p className="text-[#888] mb-6">
                      Мы свяжемся с вами в течение 24 часов для обсуждения вашего обучения.
                    </p>

                    <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                      <p className="text-sm text-[#666] mb-2">Или напишите нам напрямую:</p>
                      <a
                        href="https://t.me/zaharich777"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        Telegram @zaharich777
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
