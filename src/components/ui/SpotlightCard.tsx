"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "var(--primary-glow)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const flushSpotlight = () => {
    rafRef.current = null;
    const pending = pendingRef.current;
    const el = spotlightRef.current;
    if (!pending || !el) return;
    el.style.background = `radial-gradient(280px circle at ${pending.x}px ${pending.y}px, ${spotlightColor}, transparent 80%)`;
  };

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current || isFocused) return;
    const rect = cardRef.current.getBoundingClientRect();
    pendingRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flushSpotlight);
    }
  };

  const handleMouseEnter = () => setOpacity(0.6);
  const handleMouseLeave = () => setOpacity(0);
  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };
  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-card-border bg-card p-8 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      {/* Mouse-following spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{ opacity }}
      />
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full w-full">{children}</div>
    </div>
  );
}
