"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Code2, Cpu, Database, Globe, Rocket } from "lucide-react";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { MagneticButton } from "@/components/ui/MagneticButton";

// Floating code snippets that orbit around the terminal
const CODE_SNIPPETS = [
  { code: "func main()", icon: Code2, delay: 0 },
  { code: "go routine", icon: Cpu, delay: 0.5 },
  { code: "PostgreSQL", icon: Database, delay: 1 },
  { code: "HTTP Server", icon: Globe, delay: 1.5 },
  { code: "Deploy", icon: Rocket, delay: 2 },
];

// Matrix rain characters
const MATRIX_CHARS = "ゴーラングプログラミングコード関数型変数";

function MatrixRain() {
  const [columns, setColumns] = useState<{ chars: string[]; x: number; speed: number }[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check for mobile and reduce columns for performance
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    const columnCount = mobile ? 6 : 15;
    const cols = Array.from({ length: columnCount }, (_, i) => ({
      chars: Array.from({ length: mobile ? 5 : 10 }, () => 
        MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ),
      x: (i / columnCount) * 100,
      speed: 10 + Math.random() * 20,
    }));
    setColumns(cols);
  }, []);

  // Skip rendering on mobile for performance
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {columns.map((col, i) => (
        <motion.div
          key={i}
          className="absolute text-[#C9673A] font-mono text-xs leading-tight"
          style={{ left: `${col.x}%` }}
          initial={{ y: "-100%" }}
          animate={{ y: "100vh" }}
          transition={{
            duration: col.speed,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.3,
          }}
        >
          {col.chars.map((char, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.1 }}>{char}</div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function FloatingSnippet({ 
  code, 
  icon: Icon, 
  delay, 
  index 
}: { 
  code: string; 
  icon: typeof Code2; 
  delay: number; 
  index: number;
}) {
  const angle = (index / CODE_SNIPPETS.length) * Math.PI * 2;
  const radius = 320;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * 0.4;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: 1,
        x: [x, x + 20, x],
        y: [y, y - 10, y],
      }}
      transition={{
        opacity: { duration: 3, repeat: Infinity, delay },
        scale: { duration: 0.5, delay },
        x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252525]/80 backdrop-blur-sm rounded-full border border-[#333] text-sm">
        <Icon className="w-3.5 h-3.5 text-[#C9673A]" />
        <span className="text-[#888] font-mono">{code}</span>
      </div>
    </motion.div>
  );
}

// Animated connection lines
function ConnectionLines({ isActive }: { isActive: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9673A" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9673A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9673A" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Animated paths */}
      {[0, 1, 2, 3, 4].map((i) => {
        const startX = 100 + i * 150;
        const midY = 150 + Math.sin(i) * 50;
        return (
          <motion.path
            key={i}
            d={`M ${startX} 50 Q ${startX + 50} ${midY} 400 250`}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isActive ? {
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </svg>
  );
}

export function TerminalShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section 
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-[#18181B]"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9673A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C9673A]/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#C9673A 1px, transparent 1px), linear-gradient(90deg, #C9673A 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        
        {/* Matrix rain */}
        <MatrixRain />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest uppercase text-[#C9673A] bg-[#C9673A]/10 rounded-full border border-[#C9673A]/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Интерактивная демонстрация
          </motion.span>

          <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2ED] mb-4 text-balance">
            Посмотрите, как{" "}
            <span className="text-[#C9673A]">оживает</span>{" "}
            ваш код
          </h2>

          <p className="text-lg text-[#888] max-w-2xl mx-auto text-pretty">
            Нажмите Run и наблюдайте за магией компиляции. 
            Именно такой опыт вы получите на менторстве.
          </p>
        </motion.div>

        {/* Terminal showcase area */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating code snippets */}
          <div className="hidden lg:block absolute inset-0 -inset-x-32">
            {CODE_SNIPPETS.map((snippet, index) => (
              <FloatingSnippet key={snippet.code} {...snippet} index={index} />
            ))}
          </div>

          {/* Connection lines */}
          <div className="hidden lg:block absolute inset-0 -inset-x-32">
            <ConnectionLines isActive={isHovered} />
          </div>

          {/* Main terminal */}
          <InteractiveTerminal />

          {/* Bottom stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            {[
              { value: "< 1s", label: "Время компиляции" },
              { value: "0", label: "Ошибок" },
              { value: "100%", label: "Готовность к продакшену" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="text-2xl font-bold text-[#C9673A]">{stat.value}</div>
                <div className="text-sm text-[#666]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[#666] mb-4">
            Хотите научиться создавать такие сервисы?
          </p>
          <MagneticButton
            as="a"
            href="https://t.me/zaharich777"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9673A] hover:bg-[#E8845B] text-white rounded-lg font-medium transition-colors"
            strength={0.3}
          >
            <Rocket className="w-5 h-5" />
            Начать обучение
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
