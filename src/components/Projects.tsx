"use client";

import React, { useState } from "react";
import { ExternalLink, RotateCcw, Image as ImageIcon } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import { useTheme } from "./ThemeProvider";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  color: string;
  useIframe?: boolean;
};

function ProjectMediaPreview({ project }: { project: Project }) {
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [mode, setMode] = useState<"iframe" | "image">(
    "image",
  );

  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  if (!project.useIframe || mode === "image") {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-card-border/40 relative mb-5 bg-foreground/5 shadow-sm group/media">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/Projects/Portfolio.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {project.useIframe && (
          <button
            type="button"
            onClick={() => setMode("iframe")}
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/85 hover:bg-background text-foreground backdrop-blur-md text-[10px] font-semibold border border-card-border/70 shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            title="Switch to live scrollable app"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive View</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-card-border/40 relative mb-5 bg-card/60 shadow-sm flex flex-col group/media">
      {/* Mini Browser Bar */}
      <div className="h-7 px-3 flex items-center justify-between bg-foreground/5 border-b border-card-border/30 text-[10px] select-none flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background/60 border border-card-border/40 max-w-[170px] truncate text-[9px] text-foreground/75 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="truncate">{getDomain(project.liveUrl)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setReloadKey((k) => k + 1);
            }}
            title="Reload live app"
            className="p-1 rounded text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={() => setMode("image")}
            title="Show screenshot"
            className="p-1 rounded text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Frame content */}
      <div className="relative flex-1 w-full bg-background overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-xs gap-2">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-[10px] font-medium text-foreground/70">
              Loading preview...
            </span>
          </div>
        )}
        <iframe
          key={reloadKey}
          src={project.liveUrl}
          title={`${project.title} live interactive preview`}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 bg-background"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}

export default function Projects() {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const projectsData: Project[] = [
    {
      id: "vozme",
      title: "Vozme",
      category: "Mobile Applications",
      description:
        "A seamless file conversion utility (supporting Image, Video, and Audio files) built with a user-friendly interface and powered by in-browser client-side WebAssembly rendering.",
      image: "/images/Projects/vozme.png",
      liveUrl: "https://play.google.com/store/apps/details?id=in.vozme.vozme_app",
      tags: ["Flutter", "Dart", "Node.js", "Express.js", "PostgreSQL"],
      color: "var(--primary)",
      useIframe: false,
    },
    {
      id: "slshopee",
      title: "SL Shopee",
      category: "Web Apps",
      description:
        "A Full-stack e-commerce platform for electronics and mobile accessories, featuring a seamless shopping experience with secure authentication and smooth navigation.",
      image: "/images/Projects/slshopee.png",
      liveUrl: "https:slshopee.com",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      color: "var(--primary)",
      useIframe: false,
    },
    {
      id: "gdw",
      title: "Geethika Digital World",
      category: "Web Apps",
      description:
        "A Full-stack e-commerce platform for gifts and accessories featuring a seamless shopping experience with secure authentication and smooth navigation.",
      image: "/images/Projects/gdw.png",
      liveUrl: "https:geethikadigitalworld.com",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      color: "var(--primary)",
      useIframe: false,
    },
    {
      id: "f&m",
      title: "Friends & Memories",
      category: "Web Apps",
      description:
        "A Full-stack e-commerce platform for electronics and mobile accessories, featuring a seamless shopping experience with secure authentication and smooth navigation.",
      image: "/images/Projects/f&m.png",
      liveUrl: "https://friendsandmemories.in",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      color: "var(--primary)",
      useIframe: false,
    },
    {
      id: "campusfix",
      title: "CampusFix",
      category: "Web Apps",
      description:
        "A Full-stack platform for college students to find and book services like repairs, tech support, and more.",
      image: "/images/Projects/campusfix.png",
      liveUrl: "https://campusfix12.vercel.app",
      tags: ["React.js", "Node.js", "Express.js", "MongoDB"],
      color: "var(--primary)",
      useIframe: false,
    },
  ];

  const categories = ["All", "Web Apps", "Tools","Mobile Applications"];

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="py-24 md:py-32 relative overflow-hidden z-10 border-b border-card-border/20"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-12 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Portfolio
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Featured Projects
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4 mb-6" />
          <p className="max-w-2xl text-sm text-foreground/75 leading-relaxed">
            A curated showcase of applications and open-source tools I have
            designed, engineered, and shipped. Filter by category to explore
            specific stacks.
          </p>
        </div>

        {/* Filter Navigation Category Tabs */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground shadow-sm scale-103"
                  : "bg-card/40 hover:bg-foreground/5 text-foreground/80 border-card-border hover:border-foreground/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Projects Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              className="flex flex-col h-full bg-card/45 border-card-border hover:border-primary/40 rounded-2xl transition-all duration-300 hover:shadow-lg p-6 group"
            >
              {/* Live Iframe or Framed Image Preview */}
              <ProjectMediaPreview project={project} />

              {/* Card Meta & Header */}
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {project.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-xs md:text-sm text-foreground/75 leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-semibold bg-foreground/5 border border-card-border/50 text-foreground/70 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-background transition-all duration-300 hover:scale-102"
                  >
                    <span>Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
