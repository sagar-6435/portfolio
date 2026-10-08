"use client";

import React from "react";
import TextLoop from "./ui/TextLoop";
import { useTheme } from "./ThemeProvider";

interface TextLoopBannerProps {
  className?: string;
}

export default function TextLoopBanner({ className = "" }: TextLoopBannerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Gold ribbon with dark obsidian text in dark mode;
  // Warm bronze ribbon with parchment white text in light mode
  const ribbonColor = isDark ? "#d4af37" : "#947145";
  const textColor = isDark ? "#0a0b0e" : "#faf8f5";

  return (
    <section
      aria-label="Interactive marquee"
      className={`relative w-full overflow-hidden py-1 md:py-3 z-20 pointer-events-auto ${className}`.trim()}
    >
      <div className="w-full">
        <TextLoop
          text="Sagar Kanda ✦ Software Engineer ✦ Web Architect ✦ React & Next.js Developer ✦ Interactive UI/UX ✦ App Developer" 
          shape="wave"
          speed={60}
          direction="forward"
          separator="✦"
          curviness={22}
          fontSize={18}
          fontWeight={700}
          letterSpacing={1.5}
          uppercase
          color={textColor}
          ribbon
          ribbonColor={ribbonColor}
          ribbonWidth={38}
          viewBoxHeight={96}
          pauseOnHover
          className="w-full"
        />
      </div>
    </section>
  );
}
