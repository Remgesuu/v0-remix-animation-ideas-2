"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Play, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";

interface TerminalShowcaseProps {
  onRunTriggered?: () => void;
}

// Terminal output lines
const COMPILE_SEQUENCE = [
  { text: "$ go build -o server ./cmd/api", type: "command", delay: 0 },
  { text: "go: downloading dependencies...", type: "info", delay: 400 },
  { text: "go: found module github.com/gin-gonic/gin", type: "info", delay: 800 },
  { text: "go: found module github.com/lib/pq", type: "info", delay: 1000 },
  { text: "", type: "empty", delay: 1200 },
  { text: "$ ./server", type: "command", delay: 1400 },
  { text: "[GIN-debug] Listening on :8080", type: "success", delay: 1800 },
  { text: "[API] Connected to PostgreSQL", type: "success", delay: 2100 },
  { text: "[API] Redis cache initialized", type: "success", delay: 2300 },
  { text: "[API] Server started successfully", type: "success", delay: 2500 },
  { text: "", type: "empty", delay: 2700 },
  { text: "Ready to accept connections!", type: "final", delay: 2900 },
];

// Code to display
const CODE_CONTENT = `package main

import (
    "github.com/gin-gonic/gin"
    "log"
)

func main() {
    r := gin.Default()
    
    r.GET("/api/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })
    
    log.Fatal(r.Run(":8080"))
}`;

type RunState = "idle" | "running" | "complete";

export function TerminalShowcase({ onRunTriggered }: TerminalShowcaseProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [runState, setRunState] = useState<RunState>("idle");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const handleRun = useCallback(() => {
    if (runState === "running") return;
    
    setRunState("running");
    setVisibleLines(0);
    setProgress(0);
    
    // Notify parent (Hero) about the trigger
    onRunTriggered?.();

    // Animate through compile sequence
    COMPILE_SEQUENCE.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
        setProgress(((index + 1) / COMPILE_SEQUENCE.length) * 100);
        
        if (index === COMPILE_SEQUENCE.length - 1) {
          setTimeout(() => setRunState("complete"), 300);
        }
      }, line.delay);
    });
  }, [runState, onRunTriggered]);

  const handleReset = () => {
    setRunState("idle");
    setVisibleLines(0);
    setProgress(0);
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-[#C9673A]";
      case "info": return "text-[#888]";
      case "success": return "text-[#00D4AA]";
      case "final": return "text-[#00D4AA] font-semibold";
      default: return "text-[#666]";
    }
  };

  return (
    <section 
      ref={ref}
      id="terminal-demo"
      className="relative py-24 md:py-32 overflow-hidden bg-[#18181B]"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9673A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7DD3CA]/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#C9673A 1px, transparent 1px), linear-gradient(90deg, #C9673A 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
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
            Вот как{" "}
            <span className="text-[#C9673A]">оживает</span>{" "}
            ваш код
          </h2>

          <p className="text-lg text-[#888] max-w-2xl mx-auto text-pretty">
            Нажмите Run и наблюдайте за магией компиляции. 
            Именно такой опыт вы получите на менторстве.
          </p>
        </motion.div>

        {/* Terminal + Code Layout */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="ml-2 text-xs text-[#666] font-mono">main.go</span>
                </div>
                <span className="text-xs text-[#555] font-mono">Go 1.21</span>
              </div>

              {/* Code content */}
              <div className="p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-[#AAA]">
                  <code>{CODE_CONTENT}</code>
                </pre>
              </div>
            </div>

            {/* Terminal */}
            <div className="bg-[#0d0d0d] rounded-xl border border-[#333] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#333]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="ml-2 text-xs text-[#666] font-mono">Terminal</span>
                </div>
                
                {/* Run button */}
                <div className="flex items-center gap-2">
                  {runState === "complete" && (
                    <motion.button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#888] hover:text-[#F5F2ED] transition-colors"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={handleRun}
                    disabled={runState === "running"}
                    className={`
                      flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all
                      ${runState === "running" 
                        ? "bg-[#333] text-[#666] cursor-not-allowed" 
                        : runState === "complete"
                        ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30"
                        : "bg-[#C9673A] text-white hover:bg-[#E8845B]"
                      }
                    `}
                    whileHover={runState === "idle" ? { scale: 1.05 } : {}}
                    whileTap={runState === "idle" ? { scale: 0.95 } : {}}
                  >
                    {runState === "running" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Running...
                      </>
                    ) : runState === "complete" ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Run
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Progress bar */}
              {runState !== "idle" && (
                <div className="h-0.5 bg-[#333]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#C9673A] to-[#00D4AA]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              )}

              {/* Terminal output */}
              <div className="flex-1 p-4 font-mono text-sm min-h-[280px] overflow-y-auto">
                {runState === "idle" ? (
                  <div className="text-[#555] flex items-center gap-2">
                    <span className="text-[#C9673A]">$</span>
                    <span>Press Run to start compilation...</span>
                    <motion.span
                      className="w-2 h-4 bg-[#C9673A]"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {COMPILE_SEQUENCE.slice(0, visibleLines).map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={getLineColor(line.type)}
                      >
                        {line.text || "\u00A0"}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

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
              { value: "100%", label: "Production Ready" },
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
          <motion.a
            href="#lead-form"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9673A] hover:bg-[#E8845B] text-white rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Начать обучение
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
