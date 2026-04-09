"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "prompt";
  isTyping?: boolean;
}

// Commands to type on page load
const COMMANDS_SEQUENCE = [
  { text: "$ cd ~/zahar-go", delay: 0, typeSpeed: 40 },
  { text: "$ go mod init zahar-go", delay: 600, typeSpeed: 35 },
  { text: "go: creating new go.mod: module zahar-go", delay: 1400, typeSpeed: 0, type: "output" as const },
  { text: "$ go run main.go", delay: 2000, typeSpeed: 40 },
  { text: "Compiling...", delay: 2800, typeSpeed: 0, type: "output" as const },
  { text: "Hello, Go!", delay: 3400, typeSpeed: 0, type: "success" as const },
];

interface HeroTerminalProps {
  onGoClick: () => void;
  showGoButton: boolean;
}

export function HeroTerminal({ onGoClick, showGoButton }: HeroTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentTypingText]);
  
  // Type out commands on mount
  useEffect(() => {
    let mounted = true;
    let timeouts: NodeJS.Timeout[] = [];
    
    const typeCommand = async (command: typeof COMMANDS_SEQUENCE[0], index: number) => {
      return new Promise<void>((resolve) => {
        if (!mounted) return resolve();
        
        // If it's an output line (no typing), just add it
        if (command.typeSpeed === 0) {
          const timeout = setTimeout(() => {
            if (!mounted) return resolve();
            setLines(prev => [...prev, { 
              text: command.text, 
              type: command.type || "command" 
            }]);
            resolve();
          }, command.delay);
          timeouts.push(timeout);
          return;
        }
        
        // Start typing after delay
        const startTimeout = setTimeout(() => {
          if (!mounted) return resolve();
          
          let charIndex = 0;
          setCurrentTypingText("");
          
          const typeInterval = setInterval(() => {
            if (!mounted) {
              clearInterval(typeInterval);
              return resolve();
            }
            
            if (charIndex < command.text.length) {
              setCurrentTypingText(command.text.slice(0, charIndex + 1));
              charIndex++;
            } else {
              clearInterval(typeInterval);
              // Add completed line
              setLines(prev => [...prev, { text: command.text, type: "command" }]);
              setCurrentTypingText("");
              resolve();
            }
          }, command.typeSpeed);
        }, command.delay);
        timeouts.push(startTimeout);
      });
    };
    
    const runSequence = async () => {
      for (let i = 0; i < COMMANDS_SEQUENCE.length; i++) {
        if (!mounted) break;
        await typeCommand(COMMANDS_SEQUENCE[i], i);
      }
      if (mounted) {
        setTimeout(() => {
          setIsTypingComplete(true);
        }, 500);
      }
    };
    
    runSequence();
    
    return () => {
      mounted = false;
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);
  
  const getLineStyles = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-[#E8E8E8]";
      case "output":
        return "text-[#888888]";
      case "success":
        return "text-[#00D4AA] font-semibold";
      case "prompt":
        return "text-[#C9673A]";
      default:
        return "text-[#AAAAAA]";
    }
  };
  
  return (
    <motion.div
      className="relative bg-[#0D0D0D] rounded-xl overflow-hidden shadow-2xl border border-[#222]"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(201, 103, 58, 0.1)",
      }}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-inner" />
          </div>
          <span className="text-xs text-[#666] font-mono flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            zahar-go ~ terminal
          </span>
        </div>
        
        {/* GO Button */}
        <AnimatePresence>
          {showGoButton && isTypingComplete && (
            <motion.button
              onClick={onGoClick}
              className="relative px-6 py-1.5 bg-[#00ADD8] hover:bg-[#00C4F5] text-[#0D0D0D] rounded-md text-sm font-bold tracking-wider transition-all overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <span className="relative z-10">GO</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00ADD8] via-[#00D4AA] to-[#00ADD8]"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ opacity: 0.3 }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={containerRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm"
      >
        {/* Rendered lines */}
        {lines.map((line, index) => (
          <motion.div
            key={index}
            className={`${getLineStyles(line.type)} leading-relaxed`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
          >
            {line.text}
          </motion.div>
        ))}
        
        {/* Currently typing line */}
        {currentTypingText && (
          <div className="text-[#E8E8E8] leading-relaxed">
            {currentTypingText}
            <span 
              className={`inline-block w-2 h-4 bg-[#00ADD8] ml-0.5 align-middle transition-opacity ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
        
        {/* Cursor at end when not typing */}
        {!currentTypingText && !isTypingComplete && lines.length > 0 && (
          <div className="text-[#666]">
            <span className="text-[#C9673A]">$</span>
            <span 
              className={`inline-block w-2 h-4 bg-[#00ADD8] ml-1 align-middle transition-opacity ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
        
        {/* Final state with Hello, Go! visible */}
        {isTypingComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 pt-2 border-t border-[#222]"
          >
            <div className="text-[#666] text-xs mb-1">Ready to launch Gopher</div>
            <div className="flex items-center gap-2">
              <span className="text-[#C9673A]">$</span>
              <motion.span 
                className="inline-block w-2 h-4 bg-[#00ADD8] align-middle"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "steps(2)"
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0, 173, 216, 0.15), transparent 70%)",
        }}
        animate={isTypingComplete ? { opacity: [0, 0.6, 0.3] } : {}}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
}
