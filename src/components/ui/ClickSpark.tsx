'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../ThemeProvider';

export interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  fixed?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor,
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  fixed = true,
  className = '',
  children
}) => {
  const { theme } = useTheme();
  const defaultColor = theme === 'dark' ? '#d4af37' : '#947145';
  const effectiveColor = sparkColor || defaultColor;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  // Canvas resize logic with DPR support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      let width = window.innerWidth;
      let height = window.innerHeight;

      if (!fixed && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    let ro: ResizeObserver | null = null;
    if (!fixed && canvas.parentElement) {
      ro = new ResizeObserver(resizeCanvas);
      ro.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (ro) ro.disconnect();
    };
  }, [fixed]);

  // Efficient draw loop: runs only while sparks exist
  const startAnimation = useCallback(() => {
    if (animFrameIdRef.current !== null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = effectiveColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(draw);
  }, [duration, easeFunc, effectiveColor, extraScale, sparkRadius, sparkSize]);

  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  const addSparksAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let x = clientX;
      let y = clientY;

      if (!fixed) {
        const rect = canvas.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
      }

      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      }));

      sparksRef.current.push(...newSparks);
      startAnimation();
    },
    [fixed, sparkCount, startAnimation]
  );

  // Global pointerdown listener so clicks on any button, link, or card trigger sparks instantly
  useEffect(() => {
    if (!fixed) return;

    const handlePointerDown = (e: PointerEvent) => {
      addSparksAt(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [fixed, addSparksAt]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!fixed) {
      addSparksAt(e.clientX, e.clientY);
    }
  };

  if (children) {
    return (
      <div className={`relative w-full min-h-full ${className}`} onClick={handleClick}>
        <canvas
          ref={canvasRef}
          className={`${fixed ? 'fixed inset-0 z-[9998]' : 'absolute inset-0 z-10'} pointer-events-none`}
        />
        {children}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`${fixed ? 'fixed inset-0 z-[9998]' : 'absolute inset-0 z-10'} pointer-events-none`}
    />
  );
};

export default ClickSpark;
