"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Play, Square, RotateCcw, Terminal, Sparkles, Zap, CheckCircle2 } from "lucide-react";

// Particle system types
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "spark" | "glow" | "code";
  char?: string;
}

// Code characters for matrix effect
const CODE_CHARS = "goGOfuncmainpkgimportstringintfloaterrorchannelgoroutine{}()[]<>:=";

// Terminal output lines simulation
const TERMINAL_LINES = [
  { text: "$ go run main.go", type: "command", delay: 0 },
  { text: "Compiling main.go...", type: "info", delay: 300 },
  { text: "Resolving dependencies...", type: "info", delay: 600 },
  { text: "  → github.com/gin-gonic/gin v1.9.1", type: "dep", delay: 800 },
  { text: "  → github.com/jackc/pgx/v5 v5.4.3", type: "dep", delay: 1000 },
  { text: "  → go.uber.org/zap v1.26.0", type: "dep", delay: 1200 },
  { text: "Building binary...", type: "info", delay: 1500 },
  { text: "[GC] allocated: 2.4MB, freed: 1.1MB", type: "gc", delay: 1800 },
  { text: "Optimizing for production...", type: "info", delay: 2100 },
  { text: "✓ Build successful!", type: "success", delay: 2500 },
  { text: "", type: "empty", delay: 2700 },
  { text: "Starting server on :8080", type: "info", delay: 2900 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 3100 },
  { text: "  ZaharGo Service v1.0.0", type: "title", delay: 3300 },
  { text: "  Ready for connections!", type: "ready", delay: 3500 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 3700 },
];

export function InteractiveTerminal() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lines, setLines] = useState<typeof TERMINAL_LINES>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [showSuccessRipple, setShowSuccessRipple] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const progressControls = useAnimation();

  // Create particle
  const createParticle = useCallback((type: Particle["type"], x?: number, y?: number): Particle => {
    const container = containerRef.current;
    const rect = container?.getBoundingClientRect();
    const width = rect?.width || 400;
    const height = rect?.height || 300;

    const baseX = x ?? Math.random() * width;
    const baseY = y ?? Math.random() * height;

    const colors = ["#C9673A", "#E8845B", "#FFB088", "#F5F2ED", "#00D4AA"];
    
    return {
      id: particleIdRef.current++,
      x: baseX,
      y: baseY,
      vx: (Math.random() - 0.5) * (type === "spark" ? 8 : 3),
      vy: (Math.random() - 0.5) * (type === "spark" ? 8 : 3) - (type === "spark" ? 2 : 0),
      life: 1,
      maxLife: type === "spark" ? 0.8 : type === "glow" ? 1.5 : 2,
      size: type === "spark" ? Math.random() * 3 + 1 : type === "glow" ? Math.random() * 8 + 4 : 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
      char: type === "code" ? CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)] : undefined,
    };
  }, []);

  // Particle animation loop
  useEffect(() => {
    if (!isRunning) {
      setParticles([]);
      return;
    }

    const animate = () => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + (p.type === "spark" ? 0.15 : 0.05),
            life: p.life - (1 / 60) / p.maxLife,
          }))
          .filter(p => p.life > 0);

        // Add new particles periodically
        if (Math.random() > 0.6) {
          const type: Particle["type"] = Math.random() > 0.7 ? "spark" : Math.random() > 0.5 ? "glow" : "code";
          updated.push(createParticle(type));
        }

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, createParticle]);

  // Run command simulation
  const handleRun = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsComplete(false);
    setLines([]);
    setGlowIntensity(0.3);

    // Animate progress bar
    progressControls.set({ scaleX: 0 });
    progressControls.start({
      scaleX: 1,
      transition: { duration: 3.5, ease: "easeInOut" }
    });

    // Add burst of particles on start
    setParticles(prev => [
      ...prev,
      ...Array.from({ length: 20 }, () => createParticle("spark", 200, 20))
    ]);

    // Progressively add terminal lines
    TERMINAL_LINES.forEach((line, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        
        // Add particles on important events
        if (line.type === "success") {
          setParticles(prev => [
            ...prev,
            ...Array.from({ length: 30 }, () => createParticle("spark"))
          ]);
          setGlowIntensity(0.6);
        }
        
        if (line.type === "ready") {
          setShowSuccessRipple(true);
          setGlowIntensity(1);
          setTimeout(() => {
            setIsRunning(false);
            setIsComplete(true);
            setShowSuccessRipple(false);
          }, 500);
        }
      }, line.delay);
    });
  }, [isRunning, createParticle, progressControls]);

  // Reset terminal
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setLines([]);
    setParticles([]);
    setGlowIntensity(0);
    progressControls.set({ scaleX: 0 });
  }, [progressControls]);

  // Get line color based on type
  const getLineColor = (type: string) => {
    switch (type) {
      case "command": return "text-[#F5F2ED]";
      case "success": return "text-[#00D4AA]";
      case "dep": return "text-[#888888]";
      case "gc": return "text-[#888888] italic";
      case "title": return "text-[#C9673A] font-bold";
      case "ready": return "text-[#00D4AA] font-semibold";
      case "divider": return "text-[#C9673A]/50";
      default: return "text-[#AAAAAA]";
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Ambient glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-2xl opacity-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201, 103, 58, 0.3), transparent 70%)",
        }}
        animate={{ opacity: glowIntensity * 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Success ripple effect */}
      <AnimatePresence>
        {showSuccessRipple && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-[#00D4AA]"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Terminal window */}
      <motion.div
        ref={containerRef}
        className="relative bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-[#333]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 ${glowIntensity * 60}px rgba(201, 103, 58, ${glowIntensity * 0.3})`,
        }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#252525] border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-3 text-sm text-[#888] font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              zahar-go ~ main.go
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning && !isComplete && (
              <motion.button
                onClick={handleRun}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#C9673A] hover:bg-[#E8845B] text-white rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                Run
              </motion.button>
            )}
            
            {isRunning && (
              <motion.button
                onClick={() => setIsRunning(false)}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#555] text-white rounded-md text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Square className="w-4 h-4" />
                Stop
              </motion.button>
            )}

            {isComplete && (
              <motion.button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#333] hover:bg-[#444] text-white rounded-md text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[#333] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9673A] via-[#E8845B] to-[#00D4AA]"
            initial={{ scaleX: 0 }}
            animate={progressControls}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Terminal content area */}
        <div className="relative h-80 overflow-hidden">
          {/* Particle layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <AnimatePresence>
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: particle.life }}
                  exit={{ opacity: 0 }}
                  style={{
                    left: particle.x,
                    top: particle.y,
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.type !== "code" ? particle.color : "transparent",
                    borderRadius: particle.type === "glow" ? "50%" : "2px",
                    boxShadow: particle.type === "glow" 
                      ? `0 0 ${particle.size * 2}px ${particle.color}` 
                      : particle.type === "spark" 
                        ? `0 0 ${particle.size}px ${particle.color}`
                        : "none",
                    color: particle.color,
                    fontSize: particle.size,
                    fontFamily: "monospace",
                    fontWeight: "bold",
                  }}
                >
                  {particle.type === "code" && particle.char}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Terminal output */}
          <div className="relative p-4 font-mono text-sm h-full overflow-y-auto">
            {lines.length === 0 && !isRunning && (
              <motion.div
                className="flex flex-col items-center justify-center h-full text-[#555]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Sparkles className="w-8 h-8 mb-3 text-[#C9673A]/50" />
                <p>{"Нажмите Run, чтобы запустить Go-сервис"}</p>
                <p className="text-xs mt-1 text-[#444]">Посмотрите как оживает код</p>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {lines.map((line, index) => (
                <motion.div
                  key={index}
                  className={`${getLineColor(line.type)} ${line.type === "empty" ? "h-4" : ""}`}
                  initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.2 }}
                >
                  {line.type === "success" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle2 className="inline w-4 h-4 mr-1" />
                    </motion.span>
                  )}
                  {line.type === "ready" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Zap className="inline w-4 h-4 mr-1" />
                    </motion.span>
                  )}
                  {line.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Cursor */}
            {(isRunning || lines.length > 0) && !isComplete && (
              <motion.span
                className="inline-block w-2 h-4 bg-[#C9673A] ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </div>

          {/* Scanline effect */}
          {isRunning && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
              }}
              animate={{ y: [0, 4] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#252525] border-t border-[#333] text-xs text-[#666]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isComplete ? "bg-[#00D4AA]" : isRunning ? "bg-[#C9673A] animate-pulse" : "bg-[#555]"}`} />
              {isComplete ? "Running" : isRunning ? "Building..." : "Ready"}
            </span>
          </div>
          <span>Go 1.21 | UTF-8 | LF</span>
        </div>
      </motion.div>

      {/* Floating action hints */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute -right-4 top-1/2 transform translate-x-full -translate-y-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-[#C9673A] text-white px-4 py-2 rounded-lg text-sm shadow-lg">
              <p className="font-semibold">Сервис запущен!</p>
              <p className="text-xs opacity-80">Так будет выглядеть ваш код</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
