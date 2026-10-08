"use client";

import React, { useState } from "react";
import { GraduationCap, Briefcase, Heart, RotateCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "./ThemeProvider";

const InteractiveDotGrid = dynamic(() => import("./ui/InteractiveDotGrid"), {
  ssr: false,
});

const Lanyard = dynamic(() => import("./ui/Lanyard"), {
  ssr: false,
});

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [flipCount, setFlipCount] = useState(0);

  // Gold in dark mode, Rich Bronze/brown in light mode for higher contrast
  const dotFromColor = isDark
    ? "rgba(212, 175, 55, 0.45)"
    : "rgba(110, 80, 50, 0.45)";
  const dotToColor = isDark
    ? "rgba(212, 175, 55, 0.18)"
    : "rgba(110, 80, 50, 0.18)";

  const cards = [
    {
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      title: "Experience",
      description: "Software Engineering & Full Stack Development",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      title: "Education",
      description: "Electronics and Communication Engineering at SRKR",
    },
    {
      icon: <Heart className="w-5 h-5 text-primary" />,
      title: "Passions",
      description: "Interactive UI, Performance & Clean Architecture",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 md:py-32 relative overflow-hidden z-10"
    >
      {/* Interactive Dot Grid Background with Theme colors */}
      <InteractiveDotGrid
        gradientFrom={dotFromColor}
        gradientTo={dotToColor}
        glowColor={
          isDark ? "rgba(212, 175, 55, 0.15)" : "rgba(240, 230, 210, 0.45)"
        }
      />

      {/* Visual background details */}
      <div className="absolute top-1/2 left-0 w-[250px] h-[250px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Biography
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            About Me
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive 3D Lanyard ID Badge */}
          <div className="flex flex-col items-center justify-center w-full max-w-[480px] lg:max-w-none mx-auto lg:mx-0 h-[460px] sm:h-[520px] md:h-[620px] lg:h-[680px] relative">
            <Lanyard
              position={[0, 0, 13]}
              gravity={[0, -40, 0]}
              frontImage="/side1.png"
              backImage="/side2.png"
              imageFit="cover"
              lanyardWidth={1.2}
              flipTrigger={flipCount}
              className="w-full h-full"
            />
            <div className="flex items-center gap-3 -mt-2 z-20">
              <button
                type="button"
                onClick={() => setFlipCount((c) => c + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-card-border bg-card/80 hover:bg-card text-xs font-semibold text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 shadow-sm active:scale-95 cursor-pointer touch-manipulation"
                title="Flip to see the other photo"
              >
                <RotateCw className="w-3.5 h-3.5 text-primary" />
                Flip Badge
              </button>
              <span className="text-[11px] uppercase tracking-wider text-foreground/45 font-medium select-none pointer-events-none hidden sm:inline">
                • Drag to rotate & swing
              </span>
            </div>
          </div>

          {/* Right Column: Bio & Cards */}
          <div className="flex flex-col">
            <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-foreground mb-6 text-center md:text-left">
              Crafting premium digital products with code & creative design.
            </h3>

            <p className="text-foreground/75 leading-relaxed mb-6 text-center md:text-left">
              I am a dedicated software engineer specializing in Next.js, React,
              and modern full-stack technologies. With a strong foundation in
              development and designing, I build platforms that are not only
              performant and stable but also visually engaging.
            </p>

            <p className="text-foreground/75 leading-relaxed mb-6 text-center md:text-left">
              My design philosophy centers on clean structure, premium
              typography, and subtle micro-interactions that make interfaces
              feel responsive and alive. I believe web portfolios should be
              classic, classic, and completely unforgettable.
            </p>

            {/* Special Studio Redirect */}
            <a
              href="https://thewebgenixx.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto md:mx-0 mb-10 inline-flex items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-card/60 px-5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                taking freelance clients
              </span>
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                thewebgenixx.in →
              </span>
            </a>

            {/* Features Sub-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-card-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
                >
                  <div className="p-3 rounded-xl bg-primary/10 mb-4">
                    {card.icon}
                  </div>
                  <h4 className="text-sm font-bold tracking-wide text-foreground mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-foreground/60 text-center sm:text-left leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
