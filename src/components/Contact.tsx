"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import PixelBlast from "./ui/PixelBlast";

const GithubIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send the message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden z-10 bg-foreground/[0.005]"
    >
      {/* Interactive WebGL PixelBlast Background at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[220px] z-0 opacity-45 pointer-events-none">
        <PixelBlast
          variant="square"
          pixelSize={3.5}
          color="#bca47c"
          antialias={true}
          patternScale={2}
          patternDensity={0.8}
          transparent={true}
          liquid={true}
          liquidStrength={0.08}
          liquidRadius={1.2}
          enableRipples={true}
          rippleIntensityScale={1.5}
          rippleSpeed={0.35}
          rippleThickness={0.12}
          edgeFade={0.4}
        />
      </div>

      {/* Background stipple radial highlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-start mb-16 text-left">
          <span className="text-xs uppercase tracking-widest font-bold text-primary mb-3">
            Get in touch
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Let's Start a Conversation
          </h2>
          <div className="w-12 h-1 bg-primary rounded mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            <div>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground mb-4">
                Let's build something reliable.
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                Have a product concept, platform bottleneck, or bespoke development workflow that needs thoughtful software engineering? Drop a line, and I will get back to you with next steps.
              </p>
            </div>

            {/* Detailed Contact Cards */}
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-card-border/50 bg-card/45 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">Email me</span>
                  <a href="mailto:kandasagar2006@gmail.com" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    kandasagar2006@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-card-border/50 bg-card/45 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <a href="tel:8897536435"><span className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">Call me</span></a>
                  <a href="tel:8897536435" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    +91 88975 36435
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-card-border/50 bg-card/45 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-foreground/50">Based in</span>
                  <span className="text-sm font-semibold text-foreground">
                    Bhimavaram, India
                  </span>
                </div>
              </div>
            </div>

            {/* Social Badges */}
            <div className="pt-4 border-t border-card-border/40">
              <h4 className="text-xs uppercase tracking-widest font-bold text-foreground/45 mb-4">Connect with me</h4>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/sagar-6435"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-card-border bg-card/65 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 hover:scale-105"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sagar-kanda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-card-border bg-card/65 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 w-full">
            <SpotlightCard className="w-full bg-card/40 border-card-border hover:border-primary/20 transition-all duration-300 p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Sagar Kanda"
                      className="w-full px-4 py-3 rounded-xl border border-card-border bg-background/55 text-foreground placeholder-foreground/35 focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 text-sm"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="kandsagar2006@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-card-border bg-background/55 text-foreground placeholder-foreground/35 focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                {/* Subject Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Hiring"
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-background/55 text-foreground placeholder-foreground/35 focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-widest font-bold text-foreground/70">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Sagar, I would love to talk about building..."
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-background/55 text-foreground placeholder-foreground/35 focus:outline-none focus:border-primary focus:bg-background/80 transition-all duration-200 text-sm resize-none"
                  />
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-start gap-2.5 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider">Success</span>
                      <span className="text-xs">Your inquiry has been sent securely. I will respond to your email shortly!</span>
                    </div>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-start gap-2.5 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive dark:text-red-400 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider">Failed</span>
                      <span className="text-xs">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 hover:shadow-md cursor-pointer"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
