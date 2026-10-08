"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { scrollToSection } from "@/lib/scroll";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          // Scroll Spy detection logic
          const sections = [
            "home",
            "about",
            "services",
            "experience",
            "education",
            "skills",
            "projects",
            "contact",
          ];
          const scrollPosition = window.scrollY + window.innerHeight / 3;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const rect = el.getBoundingClientRect();
              const top = rect.top + window.scrollY;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
  ];

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        isScrolled
          ? "top-4 w-[calc(100%-2rem)] max-w-5xl rounded-2xl border border-card-border bg-card/80 shadow-lg py-3 px-6 md:px-8 backdrop-blur-md"
          : "top-6 w-[calc(100%-3rem)] max-w-6xl rounded-2xl border border-card-border/30 bg-card/45 shadow-sm py-4.5 px-6 md:px-10 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
          className="flex items-center gap-2 group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-background font-serif text-lg font-bold shadow-sm transition-all duration-300 group-hover:scale-105">
            SK
          </span>
          <span className="font-serif text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            Sagar
          </span>
        </a>

        {/* Desktop Navigation Links with animated active border */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  const sectionId = link.href.replace("#", "");
                  setActiveSection(sectionId);
                  scrollToSection(sectionId);
                }}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-250 relative py-1 group ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-card-border bg-card hover:bg-foreground/5 text-foreground transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4.5 h-4.5 text-foreground transition-transform duration-500 hover:rotate-12" />
            ) : (
              <Sun className="w-4.5 h-4.5 text-primary transition-transform duration-500 hover:rotate-45" />
            )}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="px-4.5 py-2 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-all duration-300 hover:scale-102 shadow-sm hover:shadow"
          >
            Contact
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-card-border bg-card text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4.5 h-4.5" />
            ) : (
              <Sun className="w-4.5 h-4.5 text-primary" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-card-border bg-card text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4.5 h-4.5" />
            ) : (
              <Menu className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-background/95 border border-card-border py-5 px-6 rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-250">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const sectionId = link.href.replace("#", "");
                    setActiveSection(sectionId);
                    setMobileMenuOpen(false);
                    scrollToSection(sectionId);
                  }}
                  className={`text-sm font-semibold uppercase tracking-wider transition-colors py-1 ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <hr className="border-card-border my-1" />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollToSection("contact");
              }}
              className="w-full text-center py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
