"use client";

import React from "react";
import {
  Layout,
  Cpu,
  Wrench,
  PenTool,
  BookOpen,
  Key,
  Users,
  Cloud,
} from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";

type Skill = {
  name: string;
};

type SkillCategory = {
  title: string;
  icon: React.ReactNode;
  skills: Skill[];
};

export default function Skills() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend Development",
      icon: <Layout className="w-5 h-5 text-primary" />,
      skills: [
        { name: "React.js" },
        { name: "Next.js" },
        { name: "Bootstrap" },
        { name: "Tailwind CSS" },
        { name: "HTML & CSS" },
        { name: "React Native" },
        { name: "Flutter" },
      ],
    },
    {
      title: "Backend and Database Development",
      icon: <Cpu className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Node.js" },
        { name: "Express.js" },
        { name: "REST APIs" },
        { name: "Supabase" },
        { name: "Firebase" },
        { name: "PostgreSQL" },
        { name: "MySQL" },
        { name: "MongoDB" },
      ],
    },
    {
      title: "Programming Languages",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      skills: [
        { name: "JavaScript" },
        { name: "TypeScript" },
        { name: "Python" },
        { name: "Java" },
        { name: "C" },
        { name: "Dart" },
      ],
    },
    {
      title: "Authentication & Authorization",
      icon: <Key className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Better Auth" },
        { name: "NextAuth.js" },
        { name: "Supabase Auth" },
        { name: "JWT" },
        { name: "OAuth" },
      ],
    },
    {
      title: "UI/UX & Low-Code",
      icon: <PenTool className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Figma" },
        { name: "Adobe XD" },
        {name:"Framer"},
        { name: "Sketch" },
      ],
    },
    {
      title: "AI Engineering & Workflows",
      icon: <Cpu className="w-5 h-5 text-primary" />,
      skills: [
        { name: "GitHub Copilot" },
        { name: "Cursor AI" },
        { name: "ChatGPT" },
        { name: "DeepSeek" },
        { name: "Ollama" },
        { name: "Antigravity" },
        { name: "Command Code" },
      ],
    },
    {
      title: "DevOps & Deployment",
      icon: <Cloud className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Docker" },
        { name: "Vercel" },
        { name: "Netlify" },
        { name: "Hostinger" },
        { name: "Render" },
        { name: "Railway" },
        { name: "Cloudflare" },
      ],
    },
    {
      title: "Tools",
      icon: <Wrench className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Git" },
        { name: "GitHub" },
        { name: "VS Code" },
        { name: "Notion" },
        { name: "Cloudinary" },
      ],
    },
    {
      title: "Soft Skills",
      icon: <Users className="w-5 h-5 text-primary" />,
      skills: [
        { name: "Problem Solving" },
        { name: "Leadership" },
        { name: "Communication" },
        { name: "Collaboration" },
        { name: "Adaptability" },
        { name: "Mentorship" },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="py-24 md:py-32 relative overflow-hidden z-10 bg-foreground/1"
    >
      {/* Background radial highlight */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Portfolio stack
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Skills & Abilities
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        {/* Categories Loop in a 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <SpotlightCard
              key={catIndex}
              className="w-full h-full flex flex-col justify-between"
            >
              <div>
                {/* Category Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    {category.icon}
                  </div>
                  <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Flex List */}
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="border border-card-border rounded-xl px-3.5 py-2 flex items-center bg-background/45 backdrop-blur-sm shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:border-primary/45 hover:scale-103 hover:shadow select-none"
                    >
                      <span className="text-xs font-semibold tracking-wide text-foreground/85">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
