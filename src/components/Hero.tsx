"use client";

import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import MatrixText from "./ui/MatrixText";
import ShinyText from "./ui/ShinyText";
import ASMRStaticBackground from "./ui/ASMRStaticBackground";
import { scrollToSection } from "@/lib/scroll";
import { useTheme } from "./ThemeProvider";

const DARK_FALLING_COLORS = ["#d4af37", "#f59e0b", "#eab308"];
const LIGHT_FALLING_COLORS = ["#854d0e", "#a16207", "#b45309"];

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 sm:pt-36 md:pt-28 pb-12 sm:pb-16"
    >
      {/* Background ASMR Static Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ASMRStaticBackground />
      </div>

      {/* Decorative Gradients for Visual Glow */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center flex flex-col items-center mt-2 sm:mt-0">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-card-border bg-card/75 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-primary mb-6 animate-fade-in shadow-sm">
          Available for Opportunities
        </div>

        {/* Hello Greeting */}
        <p className="text-sm md:text-base font-semibold tracking-widest uppercase text-foreground/60 mb-3 animate-fade-in">
          Hello, I'm
        </p>

        {/* Main Name Header with MatrixText animation */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 flex gap-4 flex-wrap justify-center">
          <span className="inline-block whitespace-nowrap">
            <MatrixText
              text="Sagar"
              className="text-foreground"
            />
          </span>
          <span className="inline-block whitespace-nowrap">
            <MatrixText
              text="Kanda"
              className="text-foreground"
              initialDelay={400}
            />
          </span>
        </h1>
        {/* Role Subheader with ShinyText animation */}
        <h2 className="text-xl md:text-3xl font-medium tracking-tight mb-8">
          <ShinyText
            text="Creative Software Engineer & Web Architect"
            className="text-primary font-semibold"
          />
        </h2>

        {/* Short Bio */}
        <p className="max-w-2xl text-base md:text-lg text-foreground/75 leading-relaxed mb-10">
          I design and engineer professional, pixel-perfect web applications
          with clean code and interactive aesthetics. Dedicated to speed, fluid
          animations, and premium user experiences.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href="#skills"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("skills");
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background text-sm font-semibold tracking-wide hover:bg-primary transition-all duration-300 hover:scale-102 hover:shadow-lg group"
          >
            Explore My Expertise
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="https://drive.google.com/file/d/1WtHyJJI6WwQDbcjNgl0JNIP8WJ8pyPcT/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-card-border bg-card/80 backdrop-blur-sm text-foreground text-sm font-semibold tracking-wide hover:bg-foreground/5 transition-all duration-300 hover:scale-102 hover:shadow-md"
          >
            <FileText className="w-4 h-4" />
            Resume
          </a>
        </div>

        {/* Special Studio Redirect */}
        <a
          href="https://thewebgenixx.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-10 inline-flex items-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-card/70 backdrop-blur-sm px-6 py-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg animate-fade-in"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-background font-serif text-base font-bold border border-primary/40 shadow-sm transition-transform duration-300 group-hover:rotate-6">
            S
          </span>
          <span className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
              my freelance studio — thewebgenixx is open
            </span>
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              thewebgenixx.in <span className="text-foreground/50 font-semibold">· need to hire someone? start here</span> →
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
