"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';

export interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'random' | 'evenodd';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

const defaultCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0.1,
  ease = 'cubic-bezier(0.215, 0.61, 0.355, 1)', // power3.out equivalent
  threshold = 0.1,
  rootMargin = '0px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 3,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 1,
  stagger = 0.03,
  scrambleCharset = defaultCharset,
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [animateKey, setAnimateKey] = useState(0); // Forces re-render of animation
  const [hoverActive, setHoverActive] = useState(false);

  // Intersection Observer for scroll trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (respectReducedMotion && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIntersecting(true);
      onShuffleComplete?.();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (triggerOnce) {
          observer.unobserve(el);
        }
      } else if (!triggerOnce) {
        setIsIntersecting(false);
      }
    }, {
      threshold,
      rootMargin
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, respectReducedMotion, onShuffleComplete]);

  // Generate deterministic scramble characters for each character slot
  const charsData = useMemo(() => {
    const charset = scrambleCharset || defaultCharset;
    const rolls = Math.max(1, Math.floor(shuffleTimes));
    
    return text.split('').map((char, index) => {
      const middleScrambles: string[] = [];
      for (let k = 0; k < rolls; k++) {
        middleScrambles.push(charset[Math.floor(Math.random() * charset.length)]);
      }

      // Calculate stagger delay
      let delay = 0;
      if (animationMode === 'evenodd') {
        const oddIndex = index % 2 === 1;
        if (oddIndex) {
          delay = index * stagger;
        } else {
          // Even characters start slightly after odd ones
          const oddCount = Math.ceil(text.length / 2);
          const oddTotal = duration + oddCount * stagger;
          delay = oddTotal * 0.45 + index * stagger;
        }
      } else {
        delay = Math.random() * maxDelay;
      }

      return {
        char,
        scrambles: middleScrambles,
        delay,
        index
      };
    });
  }, [text, scrambleCharset, shuffleTimes, animationMode, stagger, maxDelay, duration]);

  // Trigger loop interval if enabled
  useEffect(() => {
    if (!loop || !isIntersecting) return;

    const interval = setInterval(() => {
      setAnimateKey(prev => prev + 1);
    }, (duration + charsData.length * stagger + loopDelay) * 1000);

    return () => clearInterval(interval);
  }, [loop, isIntersecting, duration, charsData.length, stagger, loopDelay]);

  const handleMouseEnter = () => {
    if (!triggerOnHover) return;
    setHoverActive(true);
    setAnimateKey(prev => prev + 1);
  };

  const handleMouseLeave = () => {
    if (!triggerOnHover) return;
    setHoverActive(false);
  };

  const isVertical = shuffleDirection === 'up' || shuffleDirection === 'down';
  const steps = Math.max(1, Math.floor(shuffleTimes)) + 1;

  const Tag = tag as any;

  return (
    <Tag
      ref={ref}
      className={`inline-block select-none ${className}`}
      style={{
        textAlign,
        fontFamily: className.includes('font-') ? undefined : "'Press Start 2P', sans-serif",
        ...style
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {charsData.map((data, i) => {
        if (data.char === " ") {
          return <span key={i} className="inline-block">&nbsp;</span>;
        }

        // List of characters in the track
        let trackChars: string[] = [];
        if (shuffleDirection === 'right' || shuffleDirection === 'down') {
          trackChars = [data.char, ...data.scrambles, data.char];
        } else {
          trackChars = [data.char, ...data.scrambles, data.char];
        }

        const isAnimating = isIntersecting || hoverActive;

        // Calculate translation offset
        let transformValue = 'translate3d(0, 0, 0)';
        if (isAnimating) {
          if (shuffleDirection === 'right') {
            transformValue = `translate3d(0, 0, 0)`;
          } else if (shuffleDirection === 'left') {
            transformValue = `translate3d(calc(-100% * ${steps}), 0, 0)`;
          } else if (shuffleDirection === 'down') {
            transformValue = `translate3d(0, 0, 0)`;
          } else if (shuffleDirection === 'up') {
            transformValue = `translate3d(0, calc(-100% * ${steps}), 0)`;
          }
        } else {
          // Starting states
          if (shuffleDirection === 'right') {
            transformValue = `translate3d(calc(-100% * ${steps}), 0, 0)`;
          } else if (shuffleDirection === 'left') {
            transformValue = `translate3d(0, 0, 0)`;
          } else if (shuffleDirection === 'down') {
            transformValue = `translate3d(0, calc(-100% * ${steps}), 0)`;
          } else if (shuffleDirection === 'up') {
            transformValue = `translate3d(0, 0, 0)`;
          }
        }

        return (
          <span
            key={`${i}-${animateKey}`}
            className="inline-block overflow-hidden align-bottom"
            style={{
              height: isVertical ? '1.2em' : 'auto',
              width: !isVertical ? '1ch' : 'auto'
            }}
          >
            <span
              className="inline-block will-change-transform transform-gpu whitespace-nowrap text-left"
              style={{
                display: isVertical ? 'block' : 'inline-block',
                transform: transformValue,
                transition: isAnimating
                  ? `transform ${duration}s ${ease} ${data.delay}s, color ${duration}s ${ease} ${data.delay}s`
                  : 'none',
                color: isAnimating ? colorTo : colorFrom
              }}
            >
              {trackChars.map((tc, k) => (
                <span
                  key={k}
                  style={{
                    display: isVertical ? 'block' : 'inline-block',
                    width: !isVertical ? '1ch' : 'auto',
                    textAlign: 'left'
                  }}
                >
                  {tc}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </Tag>
  );
};

export default Shuffle;
