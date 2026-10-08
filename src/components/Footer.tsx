"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Globe } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="w-4 h-4">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [buttonOffset, setButtonOffset] = useState(24);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const footerElement = document.querySelector("footer");
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        const footerVisibleHeight = window.innerHeight - footerRect.top;
        if (footerVisibleHeight > 0) {
          // Push button above the top edge of the footer (visible height + 24px margin)
          setButtonOffset(footerVisibleHeight + 24);
        } else {
          setButtonOffset(24);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollToSection("home");
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const socialLinks = [
    {
      name: "The Webgenixx",
      href: "https://thewebgenixx.in/",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/sriramgandrothu/",
      icon: <LinkedInIcon />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/sagarrrr._.__?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D",
      icon: <InstagramIcon />,
    },
    {
      name: "GitHub",
      href: "https://github.com/sagar-6435",
      icon: <GitHubIcon />,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/889753645",
      icon: <WhatsAppIcon />,
    },
  ];

  return (
    <footer className="border-t border-card-border/40 bg-card/10 py-12  z-20">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center gap-8">
        {/* Branding & Logo */}
        <div className="flex items-center gap-2.5">
          <span className="flex p-2 h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary text-background font-serif text-sm font-bold shadow-sm">
            Sk
          </span>
          <span className="font-serif text-base font-bold tracking-tight text-foreground">
            Sagar Kanda
          </span>
        </div>

        {/* Social Links (Centered Row on All Screens) */}
        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-card-border/70 bg-card/50 hover:bg-foreground hover:text-background text-foreground/75 hover:border-foreground hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              aria-label={item.name}
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Copyright (At the very bottom) */}
        <div className="text-[11px] text-foreground/40 mt-2">
          <p>&copy; {currentYear === 2026 ? "2026" : `2026-${currentYear}`} Sriram Gandrothu. All rights reserved.</p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{ bottom: `${buttonOffset}px` }}
          className="fixed right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-card/85 border border-card-border text-foreground hover:text-background hover:bg-primary hover:border-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4.5 h-4.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      )}
    </footer>
  );
}
