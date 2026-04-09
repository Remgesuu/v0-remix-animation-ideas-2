"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useReducedMotion, useState } from "react";

interface AnimatedGopherProps {
  isTriggered?: boolean;
  size?: number;
}

// Orbital tech tags around Gopher
const ORBITAL_TAGS = [
  { text: "API", angle: 0, radius: 140, delay: 0 },
  { text: "gRPC", angle: 60, radius: 155, delay: 0.3 },
  { text: "SQL", angle: 120, radius: 145, delay: 0.6 },
  { text: "Worker", angle: 180, radius: 160, delay: 0.9 },
  { text: "Queue", angle: 240, radius: 150, delay: 1.2 },
  { text: "Cache", angle: 300, radius: 145, delay: 1.5 },
];

function OrbitalTag({ 
  text, 
  angle, 
  radius, 
  delay,
  isTriggered 
}: { 
  text: string; 
  angle: number; 
  radius: number; 
  delay: number;
  isTriggered: boolean;
}) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius * 0.6;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isTriggered ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3],
        scale: 1,
        x: x,
        y: y,
      }}
      transition={{
        opacity: { 
          duration: isTriggered ? 0.8 : 4, 
          repeat: Infinity, 
          delay: isTriggered ? 0 : delay 
        },
        scale: { duration: 0.6, delay },
        x: { duration: 0.3 },
        y: { duration: 0.3 },
      }}
    >
      <motion.span
        className={`
          inline-block px-3 py-1 rounded-full text-xs font-mono
          ${isTriggered 
            ? "bg-[#C9673A]/30 text-[#C9673A] border border-[#C9673A]/50" 
            : "bg-[#C9673A]/10 text-[#C9673A]/70 border border-[#C9673A]/20"
          }
        `}
        animate={isTriggered ? {
          scale: [1, 1.15, 1],
          boxShadow: [
            "0 0 0 rgba(201, 103, 58, 0)",
            "0 0 20px rgba(201, 103, 58, 0.5)",
            "0 0 0 rgba(201, 103, 58, 0)",
          ],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}

// Particle burst effect when triggered
function ParticleBurst({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 60;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#C9673A]"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function AnimatedGopher({ isTriggered = false, size = 280 }: AnimatedGopherProps) {
  const prefersReducedMotion = useReducedMotion();
  const bodyControls = useAnimation();
  const eyeControls = useAnimation();
  const [showParticles, setShowParticles] = useState(false);
  const [blinkState, setBlinkState] = useState(false);

  // Idle breathing animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    bodyControls.start({
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [bodyControls, prefersReducedMotion]);

  // Random blinking
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [prefersReducedMotion]);

  // Triggered animation
  useEffect(() => {
    if (isTriggered && !prefersReducedMotion) {
      // Body bounce
      bodyControls.start({
        scale: [1, 1.08, 0.95, 1.02, 1],
        rotate: [0, -3, 3, -1, 0],
        transition: { duration: 0.6, ease: "easeOut" },
      });

      // Eye reaction
      eyeControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
      });

      // Show particles
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 800);
    }
  }, [isTriggered, bodyControls, eyeControls, prefersReducedMotion]);

  // Eye variants for blinking
  const eyeVariants: Variants = {
    open: { scaleY: 1 },
    blink: { scaleY: 0.1 },
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size + 160, height: size + 100 }}
    >
      {/* Orbital tags */}
      {ORBITAL_TAGS.map((tag) => (
        <OrbitalTag key={tag.text} {...tag} isTriggered={isTriggered} />
      ))}

      {/* Particle burst */}
      <ParticleBurst isActive={showParticles} />

      {/* Glow effect when triggered */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={isTriggered ? {
          boxShadow: [
            "0 0 0 rgba(201, 103, 58, 0)",
            "0 0 80px rgba(201, 103, 58, 0.4)",
            "0 0 40px rgba(201, 103, 58, 0.2)",
          ],
        } : {}}
        transition={{ duration: 0.8 }}
      />

      {/* Main Gopher SVG */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        animate={bodyControls}
        className="relative z-10"
      >
        {/* Body shadow */}
        <ellipse
          cx="100"
          cy="185"
          rx="50"
          ry="10"
          fill="#C9673A"
          opacity="0.15"
        />

        {/* Body - main shape */}
        <motion.ellipse
          cx="100"
          cy="115"
          rx="55"
          ry="65"
          fill="#7DD3CA"
          stroke="#5CBBB0"
          strokeWidth="2"
        />

        {/* Belly */}
        <ellipse
          cx="100"
          cy="130"
          rx="38"
          ry="45"
          fill="#9FE8E0"
        />

        {/* Head */}
        <motion.circle
          cx="100"
          cy="65"
          r="45"
          fill="#7DD3CA"
          stroke="#5CBBB0"
          strokeWidth="2"
        />

        {/* Face - lighter area */}
        <circle
          cx="100"
          cy="70"
          r="32"
          fill="#9FE8E0"
        />

        {/* Ears */}
        <ellipse cx="60" cy="35" rx="12" ry="16" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />
        <ellipse cx="60" cy="35" rx="7" ry="10" fill="#F5B8A9" />
        
        <ellipse cx="140" cy="35" rx="12" ry="16" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />
        <ellipse cx="140" cy="35" rx="7" ry="10" fill="#F5B8A9" />

        {/* Eyes - white part */}
        <motion.g animate={eyeControls}>
          <circle cx="82" cy="58" r="12" fill="#FFFFFF" stroke="#5CBBB0" strokeWidth="1" />
          <circle cx="118" cy="58" r="12" fill="#FFFFFF" stroke="#5CBBB0" strokeWidth="1" />
        </motion.g>

        {/* Eyes - pupils with blink animation */}
        <motion.g
          variants={eyeVariants}
          animate={blinkState ? "blink" : "open"}
          style={{ originY: 0.5 }}
        >
          <circle cx="85" cy="58" r="6" fill="#2D3748" />
          <circle cx="121" cy="58" r="6" fill="#2D3748" />
          
          {/* Eye shine */}
          <circle cx="87" cy="55" r="2" fill="#FFFFFF" />
          <circle cx="123" cy="55" r="2" fill="#FFFFFF" />
        </motion.g>

        {/* Nose */}
        <ellipse cx="100" cy="75" rx="8" ry="5" fill="#5CBBB0" />
        <ellipse cx="100" cy="74" rx="5" ry="3" fill="#7DD3CA" />

        {/* Mouth - friendly smile */}
        <path
          d="M 88 85 Q 100 95 112 85"
          fill="none"
          stroke="#5CBBB0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Teeth */}
        <rect x="95" y="83" width="10" height="8" rx="2" fill="#FFFFFF" stroke="#5CBBB0" strokeWidth="1" />
        <line x1="100" y1="83" x2="100" y2="91" stroke="#5CBBB0" strokeWidth="0.5" />

        {/* Arms */}
        <ellipse cx="50" cy="120" rx="12" ry="20" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />
        <ellipse cx="150" cy="120" rx="12" ry="20" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />

        {/* Feet */}
        <ellipse cx="75" cy="175" rx="18" ry="10" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />
        <ellipse cx="125" cy="175" rx="18" ry="10" fill="#7DD3CA" stroke="#5CBBB0" strokeWidth="1.5" />

        {/* Tech accent - small code brackets on belly */}
        <text
          x="100"
          y="140"
          textAnchor="middle"
          fontSize="14"
          fontFamily="monospace"
          fill="#5CBBB0"
          fontWeight="bold"
        >
          {"{ }"}
        </text>
      </motion.svg>

      {/* Subtle glow behind gopher */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7DD3CA]/20 blur-3xl -z-10"
        style={{ width: size * 1.2, height: size * 1.2 }}
      />
    </div>
  );
}
