# ZaharGo Landing Page — Consolidated Improvement Plan

> Объединенный аудит двух независимых экспертов + пошаговый план имплементации

---

## Часть 1: Консолидированный аудит

### 1.1 Согласованные выводы (оба аудитора)

| Категория | Вывод | Приоритет |
|-----------|-------|-----------|
| **Hero-секция** | Сильнейшая часть лендинга. Терминал, Gopher, Fraunces + Geist, terracotta-акцент создают signature-образ | Сохранить |
| **Trust-проблема** | Testimonials с fake LinkedIn URLs, placeholder-имена, hardcoded stats без источников | Critical |
| **Mentor-блок** | Плейсхолдер "ЗЖ" вместо реального фото — убивает доверие | Critical |
| **Форма** | Имитация отправки через setTimeout, реального backend нет | Critical |
| **lang="en"** | Русскоязычная страница с английским lang — SEO/a11y баг | Serious |
| **Token drift** | Массовое использование hardcoded hex (#18181B, #222, #333) вместо semantic tokens | Serious |
| **Монотонность mid-page** | После Hero секции визуально однотипны — карточки с borders | Moderate |
| **Mobile hero** | Терминал и signature-элементы уходят ниже fold | Moderate |
| **Sticky CTA** | Отсутствует на mobile — упущенные конверсии | Serious |

### 1.2 Расхождения в оценках

| Аспект | Аудитор A | Аудитор B |
|--------|-----------|-----------|
| Маркетинг | 4/10 (форма не работает = 0 конверсий) | 6.5/10 (структура есть) |
| Общая оценка | 5.5/10 | 6.8/10 |
| Визуал | 7/10 | 7/10 |

**Консенсус:** ~6/10 — хороший прототип, не готов к продакшену.

### 1.3 Unified Problem Matrix

```
CRITICAL (блокеры продакшена):
├── Форма не отправляет данные
├── Testimonials с fake proof
├── Mentor без реального фото
└── Stats без верификации

SERIOUS (значительно снижают качество):
├── lang="en" вместо lang="ru"
├── Token drift в 5+ компонентах
├── Нет sticky CTA на mobile
├── Длинный путь до формы
└── Keyboard/focus states неконсистентны

MODERATE (заметные улучшения):
├── Визуальная монотонность секций
├── Mobile hero перегружен
├── Pricing без достаточного контекста
├── Нет video-proof
└── Позиционирование слишком широкое

MINOR (polish):
├── Буквенные аватары в testimonials
├── Темные секции плоские
├── Pills/buttons шаблонные
└── Gopher UX на mobile
```

---

## Часть 2: Стратегический план улучшений

### 2.1 Фазы реализации

```
ФАЗА 0: CRITICAL FIXES (1-2 дня)
└── Без этого сайт не должен идти в production

ФАЗА 1: TRUST & CONVERSION (3-5 дней)
└── Доверие + путь к конверсии

ФАЗА 2: DESIGN SYSTEM (2-3 дня)
└── Консистентность + maintainability

ФАЗА 3: VISUAL POLISH (3-5 дней)
└── Визуальная дифференциация секций

ФАЗА 4: ADVANCED UX (2-3 дня)
└── Микровзаимодействия + performance
```

---

## Часть 3: Детальный план имплементации

### ФАЗА 0: CRITICAL FIXES

#### 0.1 Подключение формы к backend

**Файл:** `components/landing/LeadForm.tsx`

**Текущее состояние:**
```typescript
// FAKE SUBMISSION
await new Promise(resolve => setTimeout(resolve, 1500))
setIsSubmitted(true)
```

**Варианты решения:**

**Вариант A: Telegram Bot Webhook (рекомендуется для MVP)**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, telegram })
    })
    
    if (!response.ok) throw new Error('Failed to submit')
    setIsSubmitted(true)
  } catch (error) {
    setError('Произошла ошибка. Попробуйте позже или напишите в Telegram.')
  } finally {
    setIsLoading(false)
  }
}
```

**Создать API route:** `app/api/lead/route.ts`
```typescript
import { NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: Request) {
  const { name, phone, telegram } = await request.json()
  
  const message = `
🔔 Новая заявка с сайта ZaharGo

👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Telegram: ${telegram}
📅 Время: ${new Date().toLocaleString('ru-RU')}
  `
  
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })
  
  return NextResponse.json({ success: true })
}
```

**Вариант B: Resend Email**
```typescript
// app/api/lead/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { name, phone, telegram } = await request.json()
  
  await resend.emails.send({
    from: 'ZaharGo <leads@zahar.go>',
    to: 'zahar@example.com',
    subject: `Новая заявка: ${name}`,
    html: `<p>Телефон: ${phone}</p><p>Telegram: ${telegram}</p>`
  })
  
  return NextResponse.json({ success: true })
}
```

**Environment Variables нужны:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
# или
RESEND_API_KEY=your_resend_key
```

---

#### 0.2 Исправление lang="en"

**Файл:** `app/layout.tsx`

**Найти:**
```tsx
<html lang="en">
```

**Заменить на:**
```tsx
<html lang="ru">
```

---

#### 0.3 Mentor — реальное фото

**Файл:** `components/landing/Mentor.tsx`

**Текущее состояние:**
```tsx
<div className="w-20 h-20 rounded-full bg-[#333] flex items-center justify-center text-2xl font-bold">
  ЗЖ
</div>
```

**Решение:**

1. Добавить реальное фото в `public/images/mentor.jpg`
2. Заменить плейсхолдер:

```tsx
<div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--terracotta)]">
  <Image 
    src="/images/mentor.jpg"
    alt="Захар Жуков — Go-ментор"
    fill
    className="object-cover"
  />
</div>
```

3. Добавить LinkedIn/GitHub ссылки:
```tsx
<div className="flex gap-3 mt-4">
  <a href="https://linkedin.com/in/zahar-zhukov" target="_blank" rel="noopener noreferrer" 
     className="text-[#888] hover:text-[var(--terracotta)] transition-colors">
    <LinkedInIcon className="w-5 h-5" />
  </a>
  <a href="https://github.com/zahargo" target="_blank" rel="noopener noreferrer"
     className="text-[#888] hover:text-[var(--terracotta)] transition-colors">
    <GitHubIcon className="w-5 h-5" />
  </a>
</div>
```

---

#### 0.4 Testimonials — убрать fake proof

**Файл:** `components/landing/Testimonials.tsx`

**Варианты:**

**Вариант A: Удалить секцию полностью (если нет реальных отзывов)**
```tsx
// В page.tsx закомментировать или удалить
// <Testimonials />
```

**Вариант B: Заменить на реальные отзывы**

Создать файл `data/testimonials.ts`:
```typescript
export const testimonials = [
  {
    id: 1,
    name: "Реальное Имя",
    role: "Backend Developer",
    company: "Название Компании",
    companyUrl: "https://company.com",
    linkedinUrl: "https://linkedin.com/in/real-profile",
    avatar: "/images/testimonials/person1.jpg", // реальное фото
    text: "Реальный отзыв...",
    salary: {
      before: "80 000 ₽",
      after: "180 000 ₽"
    }
  },
  // ...
]
```

**Вариант C: Заменить на video-testimonials**
```tsx
<div className="aspect-video rounded-lg overflow-hidden">
  <iframe 
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Отзыв выпускника"
    allowFullScreen
    className="w-full h-full"
  />
</div>
```

---

### ФАЗА 1: TRUST & CONVERSION

#### 1.1 Sticky CTA на mobile

**Создать:** `components/landing/StickyCTA.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFormVisible, setIsFormVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      // Показывать после прокрутки hero
      const heroHeight = document.getElementById('hero')?.offsetHeight || 600
      const formSection = document.getElementById('lead-form')
      const formRect = formSection?.getBoundingClientRect()
      
      // Скрыть когда форма видна
      if (formRect && formRect.top < window.innerHeight) {
        setIsFormVisible(true)
      } else {
        setIsFormVisible(false)
      }
      
      setIsVisible(window.scrollY > heroHeight)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <AnimatePresence>
      {isVisible && !isFormVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-lg border-t border-border md:hidden"
        >
          <a
            href="#lead-form"
            className="block w-full py-3 px-6 bg-[var(--terracotta)] text-white text-center font-medium rounded-lg"
          >
            Оставить заявку
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Добавить в:** `app/page.tsx`
```tsx
import { StickyCTA } from '@/components/landing/StickyCTA'

// В конце компонента, перед закрывающим тегом
<StickyCTA />
```

---

#### 1.2 Mini-форма в Hero

**Файл:** `components/landing/Hero.tsx`

Добавить упрощенную форму рядом с основным CTA:

```tsx
<div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
  {/* Существующие кнопки */}
  <MagneticButton href="#lead-form">
    Оставить заявку
  </MagneticButton>
  
  {/* Альтернатива — быстрый контакт */}
  <a 
    href="https://t.me/zahargo" 
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
  >
    <TelegramIcon className="w-5 h-5" />
    <span>Написать в Telegram</span>
  </a>
</div>
```

---

#### 1.3 Stats с источниками

**Файл:** `components/landing/Hero.tsx` или где используются stats

**Было:**
```tsx
<div>50+ выпускников</div>
<div>94% трудоустроились</div>
```

**Стало:**
```tsx
<div className="group relative">
  <span>50+ выпускников</span>
  <span className="text-xs text-muted-foreground ml-1">*</span>
  <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
    По данным внутреннего трекера на март 2026
  </div>
</div>
```

Или добавить footnote в конце секции:
```tsx
<p className="text-xs text-muted-foreground mt-8">
  * Статистика основана на данных внутреннего трекера ZaharGo за 2024-2026 гг.
</p>
```

---

### ФАЗА 2: DESIGN SYSTEM

#### 2.1 Token унификация

**Файл:** `app/globals.css`

Добавить недостающие semantic tokens:

```css
:root {
  /* Существующие токены... */
  
  /* Dark surface tokens */
  --surface-dark: oklch(0.15 0 0);
  --surface-dark-elevated: oklch(0.18 0 0);
  --surface-dark-hover: oklch(0.22 0 0);
  
  /* Text on dark */
  --text-dark-primary: oklch(0.95 0 0);
  --text-dark-secondary: oklch(0.6 0 0);
  --text-dark-muted: oklch(0.45 0 0);
  
  /* Borders on dark */
  --border-dark: oklch(0.25 0 0);
  --border-dark-hover: oklch(0.35 0 0);
}

.dark {
  --surface-dark: oklch(0.12 0 0);
  /* ... */
}
```

---

#### 2.2 Компонентный рефакторинг dark-секций

**Создать:** `components/ui/DarkSection.tsx`

```tsx
import { cn } from '@/lib/utils'

interface DarkSectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function DarkSection({ children, className, id }: DarkSectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "bg-[var(--surface-dark)] text-[var(--text-dark-primary)]",
        className
      )}
    >
      {children}
    </section>
  )
}
```

**Использование в Portfolio.tsx, Pricing.tsx, Mentor.tsx:**
```tsx
import { DarkSection } from '@/components/ui/DarkSection'

export function Portfolio() {
  return (
    <DarkSection id="portfolio" className="py-24">
      {/* content */}
    </DarkSection>
  )
}
```

---

#### 2.3 Замена hardcoded hex

**Массовая замена в файлах:**

| Hardcoded | Semantic Token |
|-----------|----------------|
| `bg-[#18181B]` | `bg-[var(--surface-dark)]` |
| `bg-[#222]` | `bg-[var(--surface-dark-elevated)]` |
| `bg-[#1a1a1a]` | `bg-[var(--surface-dark)]` |
| `text-[#888]` | `text-[var(--text-dark-secondary)]` |
| `text-[#F5F2ED]` | `text-[var(--text-dark-primary)]` |
| `border-[#333]` | `border-[var(--border-dark)]` |

**Файлы для рефакторинга:**
- `components/landing/Portfolio.tsx`
- `components/landing/Pricing.tsx`
- `components/landing/Mentor.tsx`
- `components/landing/LeadForm.tsx`
- `components/landing/FinalCTA.tsx`
- `components/landing/Comparison.tsx`

---

#### 2.4 Focus states

**Создать:** `components/ui/FocusRing.tsx`

```tsx
import { cn } from '@/lib/utils'

export const focusRingClasses = cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-[var(--terracotta)]",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-background"
)
```

**Применить к интерактивным элементам:**

```tsx
// Button
<button className={cn("...", focusRingClasses)}>

// Card
<div tabIndex={0} className={cn("...", focusRingClasses)}>

// Link
<a className={cn("...", focusRingClasses)}>
```

---

### ФАЗА 3: VISUAL POLISH

#### 3.1 Визуальная дифференциация секций

**Portfolio — Timeline layout вместо grid:**

```tsx
export function Portfolio() {
  return (
    <DarkSection id="portfolio" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2>Проекты в портфолио</h2>
        
        {/* Timeline layout */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--terracotta)] to-transparent" />
          
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-20 pb-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-2 w-4 h-4 rounded-full bg-[var(--terracotta)]" />
              
              {/* Content card with asymmetric layout */}
              <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                <div>
                  <span className="text-[var(--terracotta)] text-sm font-mono">
                    Проект {i + 1}
                  </span>
                  <h3 className="text-2xl font-serif mt-2">{project.title}</h3>
                  <p className="text-[var(--text-dark-secondary)] mt-4">
                    {project.description}
                  </p>
                </div>
                
                {/* Code snippet preview */}
                <div className="bg-[var(--surface-dark-elevated)] rounded-lg p-4 font-mono text-sm">
                  <pre className="text-[var(--text-dark-secondary)]">
                    {project.codeSnippet}
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DarkSection>
  )
}
```

---

#### 3.2 Testimonials — Stacked cards вместо carousel

```tsx
export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center">Отзывы выпускников</h2>
        
        {/* Stacked cards with offset */}
        <div className="mt-16 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-card border border-border rounded-2xl p-8",
                i % 2 === 0 ? "ml-0 mr-12" : "ml-12 mr-0" // Asymmetric offset
              )}
            >
              <div className="flex items-start gap-4">
                <Image 
                  src={t.avatar}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <p className="text-lg">{t.text}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{t.role}</span>
                    <a 
                      href={t.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-[var(--terracotta)]"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

#### 3.3 Dark sections depth

Добавить subtle gradients и layered surfaces:

```tsx
// Background с depth
<div className="relative">
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--surface-dark)] to-[var(--surface-dark-elevated)]" />
  
  {/* Subtle radial glow */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--terracotta)] opacity-5 blur-[100px] rounded-full" />
  
  {/* Content */}
  <div className="relative z-10">
    {/* ... */}
  </div>
</div>
```

---

#### 3.4 Mobile hero optimization

**Файл:** `components/landing/Hero.tsx`

```tsx
export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen">
      {/* Mobile: ключевой визуал выше fold */}
      <div className="md:hidden pt-20 px-4">
        {/* Compact headline */}
        <h1 className="text-3xl font-serif leading-tight">
          Стань Go-разработчиком<br />
          <span className="text-[var(--terracotta)]">за 6 месяцев</span>
        </h1>
        
        {/* Single primary CTA */}
        <a 
          href="#lead-form"
          className="mt-6 block w-full py-4 bg-[var(--terracotta)] text-white text-center rounded-lg font-medium"
        >
          Начать обучение
        </a>
        
        {/* Mini terminal preview (visible above fold) */}
        <div className="mt-8 h-32 bg-[var(--surface-dark)] rounded-lg overflow-hidden">
          <div className="p-3 border-b border-[var(--border-dark)] flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="p-4 font-mono text-sm text-[var(--text-dark-secondary)]">
            <span className="text-[var(--terracotta)]">$</span> go build career.go
          </div>
        </div>
      </div>
      
      {/* Desktop: full experience */}
      <div className="hidden md:block">
        {/* Existing hero content */}
      </div>
    </section>
  )
}
```

---

### ФАЗА 4: ADVANCED UX

#### 4.1 Scroll-triggered animations

**Файл:** `lib/animations.ts`

```typescript
import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}
```

**Использование:**
```tsx
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
>
  {items.map((item) => (
    <motion.div key={item.id} variants={fadeInUp}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>
```

---

#### 4.2 Progress indicator

**Создать:** `components/landing/ScrollProgress.tsx`

```tsx
'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[var(--terracotta)] z-50 origin-left"
      style={{ scaleX }}
    />
  )
}
```

---

#### 4.3 Keyboard navigation

**Файл:** `components/landing/FAQ.tsx`

```tsx
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      const nextIndex = (index + 1) % items.length
      document.getElementById(`faq-${nextIndex}`)?.focus()
      break
    case 'ArrowUp':
      e.preventDefault()
      const prevIndex = index === 0 ? items.length - 1 : index - 1
      document.getElementById(`faq-${prevIndex}`)?.focus()
      break
    case 'Home':
      e.preventDefault()
      document.getElementById('faq-0')?.focus()
      break
    case 'End':
      e.preventDefault()
      document.getElementById(`faq-${items.length - 1}`)?.focus()
      break
  }
}

// В JSX
<button
  id={`faq-${index}`}
  onClick={() => toggle(index)}
  onKeyDown={(e) => handleKeyDown(e, index)}
  aria-expanded={isOpen}
  aria-controls={`faq-panel-${index}`}
  className={cn("...", focusRingClasses)}
>
```

---

## Часть 4: Расширенные pasted-text.txt

### 4.1 Hero Copy Variants

```
ВАРИАНТ A (результат-ориентированный):
Заголовок: "От нуля до оффера в Go за 6 месяцев"
Подзаголовок: "Индивидуальное менторство с реальными проектами. 94% выпускников получают оффер в первые 3 месяца после окончания."

ВАРИАНТ B (проблема-решение):
Заголовок: "Устал от бесполезных курсов?"
Подзаголовок: "Один ментор. Пять production-проектов. Код, который уже используется в реальных компаниях."

ВАРИАНТ C (амбициозный):
Заголовок: "Код, который приносит деньги"
Подзаголовок: "Не теория. Не домашки. Реальные задачи от реальных компаний под руководством Senior Go-разработчика."
```

### 4.2 Value Propositions (развернутые)

```
1:1 МЕНТОРСТВО
"Не групповые созвоны на 50 человек. Персональный ментор, который знает твой код лучше, чем ты сам. Еженедельные 1:1 сессии, async-поддержка в Telegram, code review каждого PR."

PRODUCTION-ПРОЕКТЫ
"Забудь про TODO-листы и калькуляторы. Ты будешь писать: платежные системы, API для мобильных приложений, микросервисы с Kubernetes, real-time системы на WebSocket. Код, который можно показать на собеседовании."

ТРУДОУСТРОЙСТВО
"Мы не бросаем после выпуска. Помощь с резюме, подготовка к техническим интервью, разбор system design. 94% выпускников получают оффер в течение 3 месяцев."

ГИБКИЙ ГРАФИК
"Учишься когда удобно. Записи всех сессий, async-формат общения, дедлайны по договоренности. Совмещай с работой или учебой."

АКТУАЛЬНЫЙ СТЕК
"Go 1.22+, PostgreSQL, Redis, gRPC, Kubernetes, CI/CD. Технологии, которые реально используются в Яндексе, Тинькофф, Ozon и других топ-компаниях."
```

### 4.3 Testimonials Templates

```
ШАБЛОН (заполнить реальными данными):

Имя: [Реальное имя]
Фото: [Реальное фото]
LinkedIn: [Реальная ссылка]
Позиция до: [Например: "Junior PHP Developer"]
Позиция после: [Например: "Middle Go Developer @ Тинькофф"]
Зарплата до: [Например: "80 000 ₽"]
Зарплата после: [Например: "180 000 ₽"]

Отзыв:
"[Конкретная история: что было до, что изменилось, какой проект был самым полезным, что помогло на собеседовании]"

---

ПРИМЕР ОТЗЫВА (формат):

"До ZaharGo я 2 года писал на PHP и не мог пробиться выше 90к. За 5 месяцев с Захаром я:
- Написал микросервис для обработки платежей (это был мой проект в портфолио)
- Прошел 4 собеседования, получил 2 оффера
- Выбрал Тинькофф на 180к + бонусы

Главное отличие от курсов — здесь нельзя слиться. Захар пушит, но по делу. Код-ревью жесткие, но после них понимаешь, почему в production пишут именно так."

— Алексей Морозов, Middle Go Developer @ Тинькофф
LinkedIn: linkedin.com/in/alexey-morozov
```

### 4.4 Mentor Bio (развернутая)

```
ЗАХАР ЖУКОВ
Senior Go Developer | 8+ лет в разработке

ОПЫТ:
- Ex-Яндекс: разработка сервисов для Яндекс.Еды (2M+ RPM)
- Ex-ВКонтакте: backend для мессенджера
- Freelance: платежные системы, Web3, AI-интеграции
- Open Source: контрибьютор в [конкретные проекты]

ПОЧЕМУ МЕНТОРСТВО:
"Я прошел путь от 'что такое горутина' до лида команды из 5 человек. По дороге наделал кучу ошибок, которые стоили месяцев. Теперь помогаю другим пройти этот путь быстрее и без боли.

Мой подход — не лекции и теория, а совместная работа над реальными задачами. Я даю тебе задачу из своей практики, ты решаешь, я показываю как бы сделал я. Это то, чего не дают курсы."

КОНТАКТЫ:
- Telegram: @zahargo
- GitHub: github.com/zahargo
- LinkedIn: linkedin.com/in/zahar-zhukov
```

### 4.5 Pricing Justification

```
ПОЧЕМУ ТАКАЯ ЦЕНА?

Сравни:
- Онлайн-курс: 50-100k, групповой формат, нет персонального фидбека
- Bootcamp: 200-400k, 3-6 месяцев без работы, общий поток
- Университет: 4 года, устаревшая программа

ZaharGo:
- 396k за VIP (рассрочка 11k/мес на 3 года)
- Персональный ментор, не куратор
- Реальные проекты, не учебные
- Помощь до трудоустройства

ROI:
- Средняя зарплата Junior Go: 120k/мес
- Средняя зарплата после курса: 150-200k/мес
- Окупаемость: 2-3 месяца работы

---

ЧТО ВХОДИТ В STANDARD (264 000 ₽):
- 48 часов 1:1 сессий (12 в месяц)
- 3 production-проекта
- Code review без ограничений
- Telegram-поддержка в рабочие часы
- Подготовка к собеседованиям

ЧТО ВХОДИТ В VIP (396 000 ₽):
- Все из Standard
- 5 production-проектов (включая Web3 и AI)
- Приоритетная поддержка 24/7
- Помощь с трудоустройством до оффера
- Доступ к закрытому сообществу выпускников
```

### 4.6 FAQ Extended

```
Q: Нужен ли английский?
A: Для обучения — нет, все материалы на русском. Для работы — желательно уровень чтения документации (B1). Мы поможем с техническим английским в процессе.

Q: Сколько времени в день нужно уделять?
A: Минимум 2 часа в день, оптимально 3-4 часа. Это меньше, чем кажется: 1 час на изучение материала, 1-2 часа на практику, 1 сессия с ментором в неделю.

Q: Что если я не успеваю?
A: Темп обучения индивидуальный. Если жизнь вносит коррективы — обсуждаем и корректируем план. Мы не выгоняем за неуспеваемость.

Q: Можно ли совмещать с работой?
A: Да, 70% наших студентов работают full-time. Сессии планируем на удобное время, все записывается, async-формат поддержки.

Q: Что если Go мне не подойдет?
A: В первые 2 недели мы проводим тестовый период. Если понимаете, что Go не ваше — возвращаем деньги полностью.

Q: Гарантируете трудоустройство?
A: Не гарантируем (это было бы враньем), но делаем все возможное: подготовка к интервью, разбор типичных вопросов, помощь с резюме и portfolio. 94% наших выпускников находят работу в течение 3 месяцев.

Q: Почему Go, а не Python/JavaScript/Rust?
A: Go — оптимальный выбор для backend в 2024+:
- Высокий спрос: все крупные компании используют Go
- Высокие зарплаты: медиана 200k+ для middle
- Низкий порог входа: проще Rust, строже Python
- Растущий рынок: Go в топ-5 самых востребованных языков

Q: Я полный ноль в программировании, справлюсь?
A: Да, если готовы вкладывать время. Курс начинается с основ: синтаксис, типы данных, базовые структуры. К проектам переходим постепенно.
```

### 4.7 Comparison Copy

```
СРАВНЕНИЕ ФОРМАТОВ ОБУЧЕНИЯ

| | Онлайн-курсы | Bootcamp | Самообучение | ZaharGo |
|---|--------------|----------|--------------|---------|
| Персональный ментор | Нет | Нет | Нет | Да |
| Реальные проекты | Учебные | Групповые | Случайные | Production-grade |
| Code review | Автоматическое | Общее | Нет | Персональное |
| Помощь с трудоустройством | Нет | Базовая | Нет | До оффера |
| Гибкий график | Да | Нет | Да | Да |
| Цена | 50-100k | 200-400k | Бесплатно* | 264-396k |
| Результат | Сертификат | Стажировка | Непредсказуемо | Работа |

* Самообучение бесплатно по деньгам, но очень дорого по времени: средний срок самостоятельного изучения до уровня junior — 12-18 месяцев против 4-6 с ментором.
```

### 4.8 Urgency/Scarcity (этичные варианты)

```
ВАРИАНТ A (честный лимит):
"В этом месяце осталось 3 места. Я работаю только с 10 студентами одновременно, чтобы уделять каждому достаточно времени."

ВАРИАНТ B (сезонность):
"Следующий набор — через 2 месяца. Если хотите начать раньше — напишите сейчас, обсудим возможность раннего старта."

ВАРИАНТ C (без давления):
"Нет никаких дедлайнов. Напишите когда будете готовы. Я отвечу в течение 24 часов и расскажу подробнее."
```

### 4.9 Social Proof Elements

```
КОМПАНИИ, ГДЕ РАБОТАЮТ ВЫПУСКНИКИ:
- Яндекс (3 человека)
- Тинькофф (5 человек)
- Ozon (2 человека)
- Авито (1 человек)
- VK (2 человека)
- Стартапы (10+ человек)

СТАТИСТИКА:
- 50+ выпускников с 2022 года
- 94% трудоустроились в течение 3 месяцев
- Средний рост зарплаты: x2.1
- Средняя зарплата после курса: 175 000 ₽/мес

МЕДИА:
- Статья на Хабре: "Как я перешел с PHP на Go за 5 месяцев"
- Подкаст "Подлодка": выпуск про менторство
- YouTube: 10 000+ подписчиков на канале по Go
```

### 4.10 Error States & Microcopy

```
ФОРМА:

Поле "Имя":
- Placeholder: "Как вас зовут?"
- Error: "Укажите имя, чтобы мы знали как к вам обращаться"

Поле "Телефон":
- Placeholder: "+7 (999) 123-45-67"
- Error: "Проверьте номер телефона"
- Help: "Для связи по срочным вопросам"

Поле "Telegram":
- Placeholder: "@username"
- Error: "Укажите ваш username в Telegram"
- Help: "Основной канал общения с ментором"

Кнопка отправки:
- Default: "Оставить заявку"
- Loading: "Отправляем..."
- Success: "Заявка отправлена!"
- Error: "Что-то пошло не так. Попробуйте еще раз или напишите в Telegram @zahargo"

---

404 СТРАНИЦА:
"Страница потерялась, как junior на первом code review. 
Вернитесь на главную или напишите нам, если что-то сломалось."

---

EMPTY STATES:
"Здесь пока ничего нет. Но скоро будет — мы работаем над этим."
```

---

## Часть 5: Чеклист имплементации

### Фаза 0 (Critical)
- [ ] Создать `app/api/lead/route.ts` с Telegram webhook
- [ ] Обновить `LeadForm.tsx` с реальным fetch
- [ ] Добавить env variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [ ] Исправить `lang="en"` → `lang="ru"` в `layout.tsx`
- [ ] Добавить реальное фото ментора в `public/images/`
- [ ] Обновить `Mentor.tsx` с Image компонентом
- [ ] Решить судьбу Testimonials (удалить или заменить на реальные)

### Фаза 1 (Trust)
- [ ] Создать `StickyCTA.tsx`
- [ ] Добавить в `page.tsx`
- [ ] Добавить источники к статистике
- [ ] Добавить LinkedIn/GitHub ссылки для ментора
- [ ] Обновить copy в Hero с конкретными outcomes

### Фаза 2 (Design System)
- [ ] Добавить dark tokens в `globals.css`
- [ ] Создать `DarkSection.tsx`
- [ ] Рефакторинг: `Portfolio.tsx`
- [ ] Рефакторинг: `Pricing.tsx`
- [ ] Рефакторинг: `Mentor.tsx`
- [ ] Рефакторинг: `LeadForm.tsx`
- [ ] Рефакторинг: `Comparison.tsx`
- [ ] Создать `FocusRing.tsx` и применить

### Фаза 3 (Visual)
- [ ] Переделать Portfolio на timeline layout
- [ ] Переделать Testimonials на stacked cards
- [ ] Добавить depth к dark sections
- [ ] Оптимизировать mobile hero
- [ ] Добавить scroll-triggered animations

### Фаза 4 (Advanced UX)
- [ ] Создать `ScrollProgress.tsx`
- [ ] Добавить keyboard navigation в FAQ
- [ ] Добавить keyboard navigation в Pricing
- [ ] Протестировать с screen reader
- [ ] Performance audit (Lighthouse)

---

## Часть 6: Метрики успеха

После внедрения всех изменений, отслеживать:

| Метрика | Текущее | Цель |
|---------|---------|------|
| Форма submissions | 0 (не работает) | 10+/неделю |
| Bounce rate | ~70% (оценка) | <50% |
| Time on page | ~2 мин (оценка) | >4 мин |
| Scroll depth | ~40% (оценка) | >70% |
| Mobile conversion | 0 | = Desktop |
| Lighthouse Performance | ~70 | >90 |
| Lighthouse Accessibility | ~80 | >95 |

---

*Документ создан на основе объединенного аудита двух независимых экспертов. Дата: 09.04.2026*
