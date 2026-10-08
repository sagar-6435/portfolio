"use client";

import React from "react";
import SpotlightCard from "./ui/SpotlightCard";

type EducationItem = {
  id: number;
  institution: string;
  degree: string;
  location: string;
  duration: string;
  grade: string;
  description: string;
  logo: string;
};

export default function Education() {
  // Newest first order
  const education: EducationItem[] = [
    {
      id: 1,
      institution: "SRKR Engineering College",
      degree:
        "Bachelor of Technology, Electronics and Communication Engineering",
      location: "Bhimavaram, Andhra Pradesh, India",
      duration: "Aug 2024 - Jun 2028*",
      grade: "7.60* CGPA",
      description:
        "Pursued specialization in Artificial Intelligence and Data Science. Served as the President of PAIE Cell at SRKREC, honing public speaking and technical coordination. Also held the role of Vice President in the Student Council, organizing college fests and advocating for student welfare.",
      logo: "/images/SRKREC.jpeg",
    },
    {
      id: 2,
      institution: "Tirumala Junior College",
      degree: "Intermediate Board, M.P.C. (Mathematics, Physics, Chemistry)",
      location: "Bhimavaram, Andhra Pradesh, India",
      duration: "Jun 2022 - Apr 2024",
      grade: "96.1%",
      description:
        "Focused on core sciences (Mathematics, Physics, and Chemistry). Developed analytical and reasoning capabilities, graduating with an outstanding score in the Board examinations.",
      logo: "/images/Tirumala.png",
    },
    {
      id: 3,
      institution: "AP Model High School",
      degree: "Secondary School Certificate (SSC)",
      location: "Sankhavaram, Andhra Pradesh, India",
      duration: "Jun 2021 - May 2022",
      grade: "81.16%",
      description:
        "Built a solid academic foundation and active participation in school co-curricular activities, graduating with top rankings in the district board examinations.",
      logo: "/images/Sidd.png",
    },
  ];

  return (
    <section
      id="education"
      className="py-24 md:py-32 relative overflow-hidden z-10 bg-foreground/[0.005]"
    >
      {/* Background stipple radial highlight */}
      <div className="absolute bottom-1/3 left-0 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Academic
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Education History
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        {/* Timeline container - Line positioned on the RIGHT side */}
        <div className="relative border-r border-primary/30 mr-4 md:mr-6 pr-8 md:pr-10 space-y-12 ml-0 pl-0">
          {education.map((edu) => (
            <div key={edu.id} className="relative group">
              {/* Glowing timeline node dot - positioned on the RIGHT side */}
              <span className="absolute -right-[41px] md:-right-[49px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-primary shadow-sm transition-[transform,background-color] duration-300 group-hover:scale-110 group-hover:bg-primary">
                <span className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:bg-background" />
              </span>

              {/* Grid layout - Card displayed on left, duration on right on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_1fr] gap-6 items-start">
                {/* Card details */}
                <SpotlightCard className="w-full bg-card/40 border border-card-border hover:border-primary/30 p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    {/* Institution Logo */}
                    <div className="h-12 w-12 rounded-xl bg-white border border-card-border/50 flex items-center justify-center p-1.5 shadow-sm">
                      <img
                        src={edu.logo}
                        alt={edu.institution}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain rounded"
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold tracking-tight text-foreground">
                        {edu.institution}
                      </h3>
                      <p className="text-sm font-semibold text-foreground/80">
                        {edu.degree} &middot;{" "}
                        <span className="text-xs font-normal text-foreground/60">
                          {edu.location}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Grade Badge & Description */}
                  <div className="flex flex-col gap-3">
                    <div className="inline-flex self-start text-xs font-semibold px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary">
                      Grade: {edu.grade}
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </SpotlightCard>

                {/* Duration - Displays on right, aligned right on desktop, first on mobile */}
                <div className="text-sm font-semibold tracking-wider text-primary lg:pt-3 lg:text-right order-first lg:order-last">
                  {edu.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
