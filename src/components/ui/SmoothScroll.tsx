"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Instantiate Lenis with autoRaf and natural momentum lerp
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      autoResize: true,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // Observe document body size changes so Lenis dimensions never become stale
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    if (typeof document !== "undefined" && document.body) {
      resizeObserver.observe(document.body);
    }

    // Periodic resizes during initial load to account for WebGL canvases, images, and fonts
    const t1 = setTimeout(() => lenis.resize(), 400);
    const t2 = setTimeout(() => lenis.resize(), 1200);
    const t3 = setTimeout(() => lenis.resize(), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
}
