"use client";

import { useRef, useState, useCallback, ReactNode, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { easings } from "@/lib/animations";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics for smooth resistance feel
  const springConfig = { stiffness: 350, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
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

      // Apply falloff based on distance from center
      const falloff = Math.max(0, 1 - distance / radius);
      
      x.set(distanceX * strength * falloff);
      y.set(distanceY * strength * falloff);
    },
    [strength, radius, isMobile, disabled, x, y]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const MotionComponent = as === "a" ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
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
