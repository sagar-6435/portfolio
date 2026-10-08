"use client";

import React from "react";
import { Laptop, Palette, Cpu, Server } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function Services() {
  const services: Service[] = [
    {
      id: "01",
      title: "Full Stack Applications",
      description:
        "Engineering robust, production-ready, end-to-end web applications using React, Next.js, Node.js, and databases (PostgreSQL, MongoDB). Built for speed, speed, and seamless user flows.",
      icon: <Laptop className="w-5 h-5 text-primary" />,
    },
    {
      id: "02",
      title: "UI/UX Designing",
      description:
        "Designing high-fidelity prototypes, vector-perfect layouts, and aesthetic design systems in Figma. Emphasizing clean modern typography, logical grids, and intuitive interactive elements.",
      icon: <Palette className="w-5 h-5 text-primary" />,
    },
    {
      id: "03",
      title: "Custom Web Platforms",
      description:
        "Architecting bespoke digital ecosystems, SaaS management interfaces, e-commerce channels, and fast dashboards. Tailored from the ground up to support custom workflows.",
      icon: <Cpu className="w-5 h-5 text-primary" />,
    },
    {
      id: "04",
      title: "Backend Services",
      description:
        "Developing scalable RESTful APIs, serverless handlers, custom authentication integration (Better Auth, Supabase Auth), secure webhooks, and real-time synchronizations.",
      icon: <Server className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <section
      id="services"
      className="py-24 md:py-32 relative overflow-hidden z-10 bg-foreground/[0.01] border-y border-card-border/20"
    >
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Services
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            What I Do
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        {/* Services 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <SpotlightCard
              key={index}
              className="w-full h-full flex flex-col p-8 bg-card/45 border border-card-border/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 relative group overflow-hidden rounded-2xl hover:shadow-lg"
            >
              {/* Backing Serif Number Indicator */}
              <span className="absolute top-6 right-8 text-6xl md:text-7xl font-serif font-black text-foreground/[0.03] dark:text-foreground/[0.02] select-none pointer-events-none transition-all duration-500 group-hover:text-primary/10 group-hover:scale-110">
                {service.id}
              </span>

              <div className="flex flex-col gap-5 relative z-10">
                {/* Icon Circle */}
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/75 leading-relaxed pr-8">
                  {service.description}
                </p>
              </div>

            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
