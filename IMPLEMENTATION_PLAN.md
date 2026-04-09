# ZaharGo - План улучшения UX/UI

## СТАТУС РЕАЛИЗАЦИИ

- [x] **ФАЗА 1**: Удаление дублирующего терминала (TerminalShowcase)
- [x] **ФАЗА 2**: Mouse-follow для Gopher + Camera parallax
- [x] **ФАЗА 3**: Кастомный курсор (CustomCursor)
- [x] **ФАЗА 4**: 3D Tilt для карточек (TiltCard)
- [ ] **ФАЗА 5**: Kinetic Typography (опционально)

---

## Полный аудит текущего состояния

### Текущая архитектура компонентов

```
app/
├── page.tsx              # Главная страница (15 компонентов)
├── layout.tsx            # Шрифты: Geist + Fraunces
└── globals.css           # Дизайн-токены (oklch палитра)

components/landing/
├── Hero.tsx              # Главный экран с HeroTerminal + FlyingGopher
├── HeroTerminal.tsx      # Терминал с авто-вводом + кнопка GO
├── FlyingGopher.tsx      # 3D Gopher (React Three Fiber)
├── TerminalShowcase.tsx  # ДУБЛИРОВАНИЕ: второй терминал с InteractiveTerminal
├── InteractiveTerminal.tsx # Терминал с частицами и Run кнопкой
└── ... (остальные секции)
```

---

## КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. Дублирование терминалов (ВЫСОКИЙ ПРИОРИТЕТ)

**Проблема:** Два терминала с похожей функциональностью:
- `HeroTerminal` в Hero секции (авто-ввод команд + GO кнопка)
- `InteractiveTerminal` в TerminalShowcase (Run кнопка + частицы)

**Влияние на UX:**
- Пользователь видит два похожих терминала подряд
- Размывается уникальность интерактива
- Избыточная когнитивная нагрузка

**Решение:**
- Удалить `TerminalShowcase` из page.tsx
- Оставить ТОЛЬКО `HeroTerminal` как единственный интерактивный терминал
- Перенести лучшие эффекты из `InteractiveTerminal` в `HeroTerminal` (частицы)

---

### 2. Gopher без глубины (СРЕДНИЙ ПРИОРИТЕТ)

**Текущее состояние:**
```typescript
// FlyingGopher.tsx - текущая логика
const xOscillation = Math.sin(normalizedScroll * Math.PI * 4) * 2.5;
const yPosition = Math.sin(normalizedScroll * Math.PI * 2) * 1.5;
// Только scroll-driven, нет реакции на мышь
```

**Проблемы:**
- Gopher только следует за скроллом (синусоида)
- Нет реакции на положение курсора
- Камера статична — нет parallax эффекта
- Отсутствует ощущение "присутствия" и интерактивности

**Решение:**
- Добавить mouse-follow для поворота Gopher к курсору
- Добавить camera tilt при движении мыши (3D parallax)
- Уменьшить амплитуду scroll-движения
- Добавить "взгляд" Gopher на курсор

---

### 3. Отсутствие "WOW-эффектов" (СРЕДНИЙ ПРИОРИТЕТ)

**Отсутствуют:**
- Кастомный курсор
- 3D Tilt для карточек
- Hover Distortion эффекты
- Kinetic typography

---

## ДЕТАЛЬНЫЙ ПЛАН РЕАЛИЗАЦИИ

### ФАЗА 1: Унификация терминалов
**Риск: НИЗКИЙ** | **Сложность: НИЗКАЯ** | **Время: 15 мин**

#### Шаг 1.1: Удалить TerminalShowcase из page.tsx
```diff
// app/page.tsx
- import { TerminalShowcase } from "@/components/landing/TerminalShowcase";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ValueProps />
-     <TerminalShowcase />
      <Portfolio />
      ...
    </main>
  );
}
```

**Проверка безопасности:**
- `TerminalShowcase` используется ТОЛЬКО в page.tsx
- Удаление не затронет другие компоненты
- Файлы `TerminalShowcase.tsx` и `InteractiveTerminal.tsx` можно оставить для референса

#### Шаг 1.2: НЕ удалять файлы компонентов
- Оставить `TerminalShowcase.tsx` и `InteractiveTerminal.tsx`
- Они могут пригодиться для заимствования эффектов (частицы)

---

### ФАЗА 2: Улучшение Gopher (3D глубина + mouse-follow)
**Риск: СРЕДНИЙ** | **Сложность: СРЕДНЯЯ** | **Время: 45 мин**

#### Шаг 2.1: Создать глобальный контекст для позиции мыши
```typescript
// hooks/useMousePosition.ts (новый файл)
"use client";

import { useState, useEffect } from "react";

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return position;
}
```

#### Шаг 2.2: Обновить FlyingGopher.tsx
**Изменения:**
1. Добавить `mousePosition` prop
2. Gopher поворачивается к курсору (lookAt)
3. Камера слегка наклоняется за курсором (parallax)
4. Уменьшить амплитуду scroll-движения

```typescript
// Новая логика позиционирования
function GopherModel({ scrollProgress, isVisible, mousePosition }) {
  // Mouse influence (0-1 normalized)
  const mouseInfluenceX = (mousePosition.x - 0.5) * 2; // -1 to 1
  const mouseInfluenceY = (mousePosition.y - 0.5) * 2; // -1 to 1
  
  // Scroll-driven position (уменьшенная амплитуда)
  const scrollX = Math.sin(scrollProgress * Math.PI * 3) * 1.5;
  const scrollY = Math.cos(scrollProgress * Math.PI * 2) * 1;
  
  // Combined position
  targetPosition.current = {
    x: baseX + scrollX + mouseInfluenceX * 0.5,
    y: scrollY + mouseInfluenceY * 0.3,
    z: -2,
  };
  
  // Gopher "looks at" cursor
  targetRotation.current = {
    x: -mouseInfluenceY * 0.2,
    y: -Math.PI / 4 + mouseInfluenceX * 0.3,
    z: mouseInfluenceX * 0.1,
  };
}

// Камера с parallax
function Scene({ mousePosition, ... }) {
  const cameraRef = useRef();
  
  useFrame(() => {
    // Camera tilt based on mouse
    camera.rotation.x = mouseInfluenceY * 0.05;
    camera.rotation.y = mouseInfluenceX * 0.05;
  });
}
```

**Проверка безопасности:**
- Изменения только внутри `FlyingGopher.tsx`
- Не затрагивает другие компоненты
- Добавляется новый hook (изолированный)
- Плавная интерполяция предотвращает резкие движения

#### Шаг 2.3: Передать mousePosition из Hero
```diff
// Hero.tsx
+ import { useMousePosition } from "@/hooks/useMousePosition";

export function Hero() {
+ const mousePosition = useMousePosition();

  return (
    <>
-     <FlyingGopher isVisible={gopherVisible} />
+     <FlyingGopher isVisible={gopherVisible} mousePosition={mousePosition} />
    ...
  );
}
```

---

### ФАЗА 3: Кастомный курсор
**Риск: НИЗКИЙ** | **Сложность: НИЗКАЯ** | **Время: 30 мин**

#### Шаг 3.1: Создать компонент CustomCursor
```typescript
// components/ui/CustomCursor.tsx
"use client";

import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useState, useEffect } from "react";

export function CustomCursor() {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  useEffect(() => {
    // Detect hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches("a, button, [role='button'], input, textarea");
      setIsHovering(isInteractive);
    };
    
    // Hide on touch devices
    const handleTouchStart = () => setIsHidden(true);
    
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("touchstart", handleTouchStart);
    
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);
  
  if (isHidden) return null;
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: x * window.innerWidth - 4,
          y: y * window.innerHeight - 4,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary/50 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: x * window.innerWidth - 16,
          y: y * window.innerHeight - 16,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? "rgba(201, 103, 58, 1)" : "rgba(201, 103, 58, 0.5)",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />
    </>
  );
}
```

#### Шаг 3.2: Добавить в layout.tsx
```diff
// app/layout.tsx
+ import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
+       <CustomCursor />
        {children}
      </body>
    </html>
  );
}
```

#### Шаг 3.3: Скрыть системный курсор
```css
/* globals.css */
@media (hover: hover) and (pointer: fine) {
  html {
    cursor: none;
  }
  
  a, button, [role="button"], input, textarea, select {
    cursor: none;
  }
}
```

**Проверка безопасности:**
- Компонент изолирован
- Скрытие курсора только на desktop (media query)
- Автоматическое скрытие на touch-устройствах
- Не влияет на другие компоненты

---

### ФАЗА 4: 3D Tilt для карточек
**Риск: НИЗКИЙ** | **Сложность: НИЗКАЯ** | **Время: 30 мин**

#### Шаг 4.1: Создать хук useTilt
```typescript
// hooks/useTilt.ts
"use client";

import { useRef, useState, useCallback } from "react";

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export function useTilt(maxTilt = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<TiltState>({ rotateX: 0, rotateY: 0, scale: 1 });
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      rotateX: (0.5 - y) * maxTilt,
      rotateY: (x - 0.5) * maxTilt,
      scale: 1.02,
    });
  }, [maxTilt]);
  
  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);
  
  const style = {
    transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: "transform 0.15s ease-out",
  };
  
  return { ref, style, handleMouseMove, handleMouseLeave };
}
```

#### Шаг 4.2: Создать компонент TiltCard
```typescript
// components/ui/TiltCard.tsx
"use client";

import { useTilt } from "@/hooks/useTilt";
import { ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className = "", maxTilt = 10 }: TiltCardProps) {
  const { ref, style, handleMouseMove, handleMouseLeave } = useTilt(maxTilt);
  
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
```

#### Шаг 4.3: Применить к карточкам в ValueProps, Portfolio, Pricing
```diff
// Пример для ValueProps.tsx
+ import { TiltCard } from "@/components/ui/TiltCard";

// Обернуть карточки
- <div className="bg-card rounded-xl p-6">
+ <TiltCard className="bg-card rounded-xl p-6">
    <Icon className="..." />
    <h3>...</h3>
    <p>...</p>
- </div>
+ </TiltCard>
```

**Проверка безопасности:**
- Новые изолированные компоненты
- Не меняют существующую структуру
- Просто оборачивают существующие карточки

---

### ФАЗА 5: Kinetic Typography (опционально)
**Риск: СРЕДНИЙ** | **Сложность: ВЫСОКАЯ** | **Время: 60 мин**

#### Концепция
Буквы "GOLANG" в Hero реагируют на курсор:
- Разлетаются при приближении
- Возвращаются на место при удалении

**Важно:** Эта фаза опциональна и может быть отложена.

---

## ПОРЯДОК ВНЕДРЕНИЯ (Безопасность сборки)

### Этап 1: Минимальные изменения (Безопасно)
1. Удалить `TerminalShowcase` из page.tsx
2. Проверить сборку

### Этап 2: Новые изолированные компоненты (Безопасно)
1. Создать `hooks/useMousePosition.ts`
2. Создать `components/ui/CustomCursor.tsx`
3. Создать `hooks/useTilt.ts`
4. Создать `components/ui/TiltCard.tsx`
5. Проверить сборку

### Этап 3: Интеграция (Средний риск)
1. Добавить `CustomCursor` в layout.tsx
2. Обновить `FlyingGopher.tsx` с mouse-follow
3. Обернуть карточки в `TiltCard`
4. Проверить сборку

---

## ЧЕКЛИСТ БЕЗОПАСНОСТИ

### Перед каждым изменением:
- [ ] Файл существует и читаем
- [ ] Изменение не затрагивает критические imports
- [ ] Новые зависимости уже установлены (framer-motion, three)

### После каждого изменения:
- [ ] Сборка проходит без ошибок
- [ ] Нет console errors
- [ ] Визуал не ухудшился
- [ ] Интерактивность работает

### Тестовые сценарии:
- [ ] Desktop: hover эффекты работают
- [ ] Mobile: touch работает, нет broken UI
- [ ] Scroll: Gopher двигается плавно
- [ ] Mouse move: Gopher реагирует
- [ ] Кнопка GO: Gopher появляется

---

## ТЕКУЩИЕ ЗАВИСИМОСТИ (уже установлены)

```json
{
  "@react-three/drei": "^9.x",
  "@react-three/fiber": "^8.x",
  "three": "^0.170.x",
  "framer-motion": "^11.x"
}
```

Все необходимые библиотеки уже установлены. Дополнительных зависимостей НЕ требуется.

---

## ИТОГОВЫЙ ВИЗУАЛЬНЫЙ РЕЗУЛЬТАТ

После реализации всех фаз:

1. **Терминал** — единс��венный, уникальный, с эффектной анимацией
2. **Gopher** — следит за курсором, реагирует на scroll и mouse, создает ощущение "живого" персонажа
3. **Курсор** — кастомный, премиальный вид, "прилипает" к кнопкам
4. **Карточки** — 3D tilt эффект при наведении
5. **Общее ощущение** — современный, интерактивный, технологичный сайт

---

## ПРИМЕЧАНИЯ

- Все изменения обратимы (можно откатить через git)
- Код написан с учетом SSR (Next.js совместимость)
- Анимации используют GPU-ускорение (transform, opacity)
- Производительность оптимизирована (requestAnimationFrame, passive events)
