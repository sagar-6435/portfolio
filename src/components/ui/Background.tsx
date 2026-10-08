"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BackgroundProps {
  /** Hero content rendered above the particles */
  children?: ReactNode;
  className?: string;
  /** Lower this (300-500) for low-end mobile devices */
  particleCount?: number;
  /** Show the custom cursor ring (desktop only) */
  showCursor?: boolean;
}

export function Background({
  children,
  className,
  particleCount = 1000,
  showCursor = true,
}: BackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!container || !canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let running = false;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };

    const MAGNETIC_RADIUS = 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      alpha = 0;
      color = "";
      rotation = 0;
      rotationSpeed = 0;
      frictionGlow = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        // 70% charcoal, 30% glass
        this.color = Math.random() > 0.7 ? "240, 245, 255" : "80, 80, 85";
        this.alpha = Math.random() * 0.4 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 0.001) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;

          // Magnetic pull toward the pointer
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;

          // Swirl (perpendicular to the radius)
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;

          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Background jitter
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;

        this.rotation +=
          this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        // Screen wrap
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const a = Math.min(this.alpha + this.frictionGlow, 0.9);
        ctx.fillStyle = `rgba(${this.color}, ${a})`;

        if (this.frictionGlow > 0.3) {
          ctx.shadowBlur = 8 * this.frictionGlow;
          ctx.shadowColor = `rgba(180, 220, 255, ${this.frictionGlow})`;
        }

        // Shard geometry
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2.5);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size * 2.5);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    const init = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
      ctx.fillStyle = "rgb(10, 10, 12)";
      ctx.fillRect(0, 0, width, height);
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const render = () => {
      // Slight motion blur trail
      ctx.fillStyle = "rgba(10, 10, 12, 0.18)";
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.update();
        p.draw();
      }
      frameId = requestAnimationFrame(render);
    };

    const start = () => {
      if (running) return;
      running = true;
      frameId = requestAnimationFrame(render);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };

    const setPointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      }
    };

    const onMouseMove = (e: MouseEvent) => setPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    };

    // Re-init when the hero changes size
    const resizeObserver = new ResizeObserver(init);
    resizeObserver.observe(container);

    // Pause the animation when the hero scrolls out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    init();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-[#0a0a0c]",
        showCursor && "md:cursor-none",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />

      {/* Your hero content sits above the particles */}
      <div className="relative z-10">{children}</div>

      {showCursor && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-4 w-4 rounded-full border border-white/20 md:block"
          style={{ transform: "translate(-100px, -100px)" }}
        />
      )}
    </div>
  );
}

export default Background;