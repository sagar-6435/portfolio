"use client";

import React from "react";
import SpotlightCard from "./ui/SpotlightCard";

type ExperienceItem = {
  id: number;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string;
  logo: string;
};

export default function Experience() {
  // Newest first order
  const experiences: ExperienceItem[] = [
    {
      id: 1,
      company: "Saptarishi Solutions Pvt. Ltd.",
      role: "Full Stack Developer",
      location: "Miyapur, Hyderabad, India",
      duration: "Oct 2025 - Present",
      description:
        "Leading the end-to-end design, development, and delivery of production-ready enterprise applications, including an HRMS platform, LMA, and Data Migration Dashboards. Managing backend services, real-time data flows, and tech stacks (Next.js, Redux, PostgreSQL). Overseeing PR checks and coding rules to maintain quality across development pipelines.",
      logo: "/images/saptarishi.png",
    },
    {
      id: 2,
      company: "Sumeru Technology Solutions Pvt. Ltd.",
      role: "Engineering Intern",
      location: "Bengaluru, Karnataka, India",
      duration: "Dec 2024 - Oct 2025",
      description:
        "Contributed to building, debugging, and testing responsive web applications using Next.js and Supabase. Developed dynamic page modules, managed serverless backend queries, and implemented error handling validations with Zod to improve platform stability.",
      logo: "/images/sumeru.jpg",
    },
    {
      id: 3,
      company: "Vedic Vision Hackathon",
      role: "Full Stack Mentor",
      location: "Bhimavaram, Andhra Pradesh, India",
      duration: "Aug 2024",
      description:
        "Mentored participating teams through the full development cycle of hackathon submissions. Provided technical guidance on stack architectures (React, Node.js, MongoDB), helped debug integration bottlenecks, and advised on database scaling and clean UI structures.",
      logo: "/images/SRKREC.jpeg",
    },
    {
      id: 4,
      company: "Freelancing & Consulting",
      role: "Freelance Full Stack Developer",
      location: "Remote",
      duration: "Jan 2024 - Present",
      description:
        "Accepting freelance projects, designing client websites, full-stack tools, custom platforms, and custom business management solutions. Architecting bespoke platforms to resolve specific company workflow blockages.",
      logo: "/images/freelancer.png",
    },
  ];

  return (
    <section
      id="experience"
      className="py-24 md:py-32 relative overflow-hidden z-10"
    >
      {/* Background stipple radial highlight */}
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Work Experience
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        {/* Timeline container */}
        <div className="relative border-l border-primary/30 ml-4 md:ml-6 pl-8 md:pl-10 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Glowing timeline node dot */}
              <span className="absolute -left-[41px] md:-left-[49px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary shadow-sm transition-[transform,background-color] duration-300 group-hover:scale-110 group-hover:bg-primary">
                <span className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:bg-background" />
              </span>

              {/* Grid layout splitting duration and card content */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr] gap-4 items-start">
                {/* Duration */}
                <div className="text-sm font-semibold tracking-wider text-primary lg:pt-3">
                  {exp.duration}
                </div>

                {/* Card details */}
                <SpotlightCard className="w-full bg-card/40 border border-card-border hover:border-primary/30 p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    {/* Company Logo */}
                    <div className="h-12 w-12 rounded-xl bg-white border border-card-border/50 flex items-center justify-center p-1.5 shadow-sm">
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain rounded"
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold tracking-tight text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-foreground/80">
                        {exp.company} &middot;{" "}
                        <span className="text-xs font-normal text-foreground/60">
                          {exp.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {exp.description}
                  </p>
                </SpotlightCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
