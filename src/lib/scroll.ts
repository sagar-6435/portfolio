"use client";

/**
 * Reusable scrolling helper that leverages the global Lenis instance
 * (attached to window.lenis) for smooth scroll animations if active,
 * otherwise falls back to native scroll APIs.
 */
export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;

  const lenis = (window as any).lenis;

  if (id === "home") {
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, {
        force: true,
        duration: 0.9,
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  // Calculate exact, immutable document-top coordinate regardless of current viewport scroll position
  let top = 0;
  let curr: HTMLElement | null = el;
  while (curr) {
    top += curr.offsetTop;
    curr = curr.offsetParent as HTMLElement | null;
  }
  const targetOffset = Math.max(0, top - 84);

  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(targetOffset, {
      force: true,
      duration: 0.9,
    });
  } else {
    window.scrollTo({ top: targetOffset, behavior: "smooth" });
  }
}
