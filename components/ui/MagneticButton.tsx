"use client";

import { useRef, useState, useCallback, ReactNode, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number; // Activation radius
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Eased falloff function for smooth magnetic release
function easedFalloff(distance: number, radius: number): number {
  const normalized = Math.min(distance / radius, 1);
  // Cubic ease-out for smooth, natural decay
  return 1 - (normalized * normalized * normalized);
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  radius = 100,
  as = "button",
  href,
  target,
  rel,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Spring physics - higher damping for smoother return without jitter
  const springConfig = { stiffness: 300, damping: 28, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Check for mobile/touch on mount
  useEffect(() => {
    const checkMobile = () => {
      // More robust touch detection
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isNarrow = window.innerWidth < 768;
      setIsMobile(hasTouch || isNarrow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || isMobile || disabled) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      // Eased falloff for smooth magnetic release
      const falloff = easedFalloff(distance, radius);
      
      x.set(distanceX * strength * falloff);
      y.set(distanceY * strength * falloff);
    },
    [strength, radius, isMobile, disabled, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    // Smooth return to center
    x.set(0);
    y.set(0);
  }, [x, y]);

  const MotionComponent = as === "a" ? motion.a : motion.button;

  // On mobile: simple tap animation, no magnetic effect
  if (isMobile) {
    return (
      <MotionComponent
        href={as === "a" ? href : undefined}
        target={as === "a" ? target : undefined}
        rel={as === "a" ? rel : undefined}
        onClick={onClick}
        disabled={disabled}
        className={className}
        whileTap={{ scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {children}
      </MotionComponent>
    );
  }

  // Desktop: full magnetic effect
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <MotionComponent
        href={as === "a" ? href : undefined}
        target={as === "a" ? target : undefined}
        rel={as === "a" ? rel : undefined}
        onClick={onClick}
        disabled={disabled}
        className={className}
        style={{ x, y }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          scale: {
            type: "spring",
            stiffness: 400,
            damping: 25,
          },
        }}
      >
        {children}
      </MotionComponent>
    </motion.div>
  );
}
