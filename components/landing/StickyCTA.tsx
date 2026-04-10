"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show after scrolling past hero (1vh)
      const showThreshold = viewportHeight;
      
      // Hide when near footer/lead-form sections
      const leadForm = document.getElementById("lead-form");
      const finalCTA = document.querySelector("[class*='FinalCTA']") || document.querySelector("section:has(a[href='#lead-form']):last-of-type");
      
      let hideThreshold = document.body.scrollHeight - viewportHeight * 2;
      
      if (leadForm) {
        const leadFormTop = leadForm.getBoundingClientRect().top + scrollY;
        hideThreshold = Math.min(hideThreshold, leadFormTop - viewportHeight);
      }
      
      // Show/hide logic
      if (scrollY > showThreshold && scrollY < hideThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Background blur */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent -z-10" />
          
          <a
            href="#lead-form"
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
          >
            Оставить заявку
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
