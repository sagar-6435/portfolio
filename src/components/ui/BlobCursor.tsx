"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function TargetCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {/* Central gold target dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-primary"
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
      />

      {/* Target gold ring */}
      <motion.div
        className="absolute w-7 h-7 rounded-full border border-primary/50 flex items-center justify-center"
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered
            ? "rgba(212, 175, 55, 0.9)" // Bright gold on hover
            : "rgba(212, 175, 55, 0.5)",
          rotate: isHovered ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
      >
        {/* Ticks on the gold target ring */}
        <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-0.5 h-1 bg-primary/60" />
        <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0.5 h-1 bg-primary/60" />
        <div className="absolute left-[-3px] top-1/2 -translate-y-1/2 h-0.5 w-1 bg-primary/60" />
        <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 h-0.5 w-1 bg-primary/60" />
      </motion.div>
    </motion.div>
  );
}
