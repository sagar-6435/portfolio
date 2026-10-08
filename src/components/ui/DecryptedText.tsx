"use client";

import React, { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  animateOn?: "hover" | "view";
  className?: string;
}

const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()_+{}[]|;:<>?,./";

export default function DecryptedText({
  text,
  speed = 30,
  maxIterations = 10,
  sequential = true,
  animateOn = "view",
  className = "",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const startDecrypt = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let iterations = 0;
    const length = text.length;
    const chars = text.split("");

    const run = () => {
      let completed = true;
      const updatedChars = chars.map((char, index) => {
        if (char === " ") return " ";
        
        let isResolved = false;
        if (sequential) {
          // Resolve sequentially from left to right
          const resolveThreshold = (iterations / maxIterations) * length;
          isResolved = index < resolveThreshold;
        } else {
          isResolved = iterations >= maxIterations;
        }

        if (isResolved) {
          return text[index];
        } else {
          completed = false;
          return randomChars[Math.floor(Math.random() * randomChars.length)];
        }
      });

      setDisplayText(updatedChars.join(""));
      iterations++;

      if (!completed) {
        setTimeout(run, speed);
      } else {
        isAnimating.current = false;
      }
    };

    run();
  };

  useEffect(() => {
    if (animateOn === "view") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startDecrypt();
          }
        },
        { threshold: 0.1 }
      );
      if (triggerRef.current) {
        observer.observe(triggerRef.current);
      }
      return () => observer.disconnect();
    }
  }, [text, animateOn]);

  const handleMouseEnter = () => {
    if (animateOn === "hover") {
      startDecrypt();
    }
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      className={className}
      style={{ display: "inline-block" }}
    >
      {displayText}
    </span>
  );
}
