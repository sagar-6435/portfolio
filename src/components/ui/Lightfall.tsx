"use client";

import React, { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface LightfallProps {
  className?: string;
  dpr?: number;
  paused?: boolean;
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  streakCount?: number;
  streakWidth?: number;
  streakLength?: number;
  glow?: number;
  density?: number;
  twinkle?: number;
  zoom?: number;
  backgroundGlow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  mouseDampening?: number;
  lightMode?: boolean;
  mixBlendMode?: string;
}

type RGB = [number, number, number];

const MAX_COLORS = 8;

const hexToRGB = (hex: string): RGB => {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  c = c.padEnd(6, "0");
  const r = (parseInt(c.slice(0, 2), 16) || 0) / 255;
  const g = (parseInt(c.slice(2, 4), 16) || 0) / 255;
  const b = (parseInt(c.slice(4, 6), 16) || 0) / 255;
  return [r, g, b];
};

const prepColors = (input?: string[]) => {
  const base = (
    input && input.length ? input : ["#A6C8FF", "#5227FF", "#FF9FFC"]
  ).slice(0, MAX_COLORS);
  const count = base.length;
  const arr: RGB[] = [];
  for (let i = 0; i < MAX_COLORS; i++)
    arr.push(hexToRGB(base[Math.min(i, base.length - 1)]));
  const avg: RGB = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0];
    avg[1] += arr[i][1];
    avg[2] += arr[i][2];
  }
  avg[0] /= count;
  avg[1] /= count;
  avg[2] /= count;
  return { arr, count, avg };
};

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uLightMode;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  float maxDim = max(max(r.x, r.y), 1.0);
  vec2 P = (frag + frag - r) / maxDim;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < MARCH_STEPS; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(max(length(O * O), 0.0));
    z += d;
  }
  return vec2(O.x, atan(O.z, abs(O.y) < 1e-5 ? 1e-5 : O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  float maxDim = max(max(r.x, r.y), 1.0);
  vec2 uv0 = (C + C - r) / maxDim;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = CDY_EXPR;
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / maxDim) * vec2(0.0, 1.0);
  vec4 O = uLightMode > 0.5
    ? vec4(0.0)
    : vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / maxDim;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  if (uLightMode > 0.5) {
    float peak = max(colr.r, max(colr.g, colr.b));
    float coverage = smoothstep(0.035, 0.58, peak) * uOpacity;
    vec3 chroma = clamp(colr / max(peak, 1e-4), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.35));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 1e-4);
    o = vec4(mix(vec3(1.0), chroma, coverage * 0.94), coverage);
  } else {
    float peak = max(colr.r, max(colr.g, colr.b));
    float alpha = smoothstep(0.015, 0.45, peak) * uOpacity;
    o = vec4(colr, alpha);
  }
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`;

// Touch GPUs hit the watchdog on the full shader (3 raymarches x 24 steps per pixel).
const LITE_DEFINES = `#define MARCH_STEPS 12
#define CDY_EXPR (c0 + vec2(cdx.y - c0.y, cdx.x - c0.x))
`;
const FULL_DEFINES = `#define MARCH_STEPS 24
#define CDY_EXPR sceneC(C + vec2(0.0, 1.0), r)
`;

const Lightfall: React.FC<LightfallProps> = ({
  className,
  dpr,
  paused = false,
  colors = ["#A6C8FF", "#5227FF", "#FF9FFC"],
  backgroundColor = "#0A29FF",
  speed = 0.5,
  streakCount = 2,
  streakWidth = 1,
  streakLength = 1,
  glow = 1,
  density = 0.6,
  twinkle = 1,
  zoom = 3,
  backgroundGlow = 0.5,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
  lightMode = false,
  mixBlendMode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const uniformsRef = useRef<Record<string, { value: any }> | null>(null);
  const mouseTargetRef = useRef<[number, number]>([-9999, -9999]);
  const hasMovedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const [epoch, setEpoch] = useState(0);

  // Initialize WebGL once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialDpr =
      dpr ??
      (typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 1.5)
        : 1);
    const rendererOptions = {
      dpr: initialDpr,
      alpha: true,
      antialias: false,
    };
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer(
        isTouchDevice
          ? rendererOptions
          : { ...rendererOptions, powerPreference: "high-performance" },
      );
    } catch (e) {
      console.warn(
        "Lightfall: retrying WebGL init without powerPreference:",
        e,
      );
      try {
        renderer = new Renderer(rendererOptions);
      } catch (e2) {
        console.warn("WebGL initialization failed in Lightfall:", e2);
        return;
      }
    }

    if (!renderer || !renderer.gl) {
      console.warn("WebGL context unavailable in Lightfall");
      return;
    }

    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const { arr, count, avg } = prepColors(colors);

    const uniforms: Record<string, { value: any }> = {
      iResolution: {
        value: [gl.drawingBufferWidth || 300, gl.drawingBufferHeight || 300, 1],
      },
      iMouse: { value: [-9999, -9999] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: hexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: {
        value: Math.max(1, Math.min(16, Math.round(streakCount))),
      },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
      uLightMode: { value: lightMode ? 1 : 0 },
    };
    uniformsRef.current = uniforms;

    let program: Program;
    try {
      program = new Program(gl, {
        vertex,
        fragment: (isTouchDevice ? LITE_DEFINES : FULL_DEFINES) + fragment,
        uniforms,
      });
      programRef.current = program;
    } catch (err) {
      console.warn("Lightfall Program initialization failed:", err);
      return;
    }

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        renderer.setSize(rect.width, rect.height);
        uniforms.iResolution.value = [
          gl.drawingBufferWidth,
          gl.drawingBufferHeight,
          1,
        ];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("resize", resize, { passive: true });

    const onContextLost = (e: Event) => {
      e.preventDefault();
      // Remount to rebuild the GL context instead of staying blank.
      setTimeout(() => setEpoch((n) => n + 1), 300);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        uniforms.iMouse.value = [x, y];
      } else if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };

    const handleTouch = (touch: Touch) => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (touch.clientX - rect.left) * scale;
      const y = (rect.height - (touch.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        uniforms.iMouse.value = [x, y];
      } else if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) handleTouch(e.touches[0]);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) handleTouch(e.touches[0]);
    };

    if (mouseInteraction) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '100px' });
    io.observe(container);

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!visible) return;
      uniforms.iTime.value = t * 0.001;
      if (mouseDampening > 0 && hasMovedRef.current) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value as number[];
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }
      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
      if (mouseInteraction) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      }
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
      const callIfFn = (obj: unknown, key: string) => {
        const fn = obj && (obj as Record<string, unknown>)[key];
        if (typeof fn === "function") {
          (fn as () => void).call(obj);
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
      uniformsRef.current = null;
    };
  }, [epoch]); // WebGL mount; epoch bumps on context loss

  // Dynamically update uniforms and DPR without destroying WebGL context
  useEffect(() => {
    if (!uniformsRef.current || !rendererRef.current) return;

    if (dpr !== undefined && rendererRef.current.dpr !== dpr) {
      rendererRef.current.dpr = dpr;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          rendererRef.current.setSize(rect.width, rect.height);
          const gl = rendererRef.current.gl;
          if (gl) {
            uniformsRef.current.iResolution.value = [
              gl.drawingBufferWidth,
              gl.drawingBufferHeight,
              1,
            ];
          }
        }
      }
    }

    const u = uniformsRef.current;
    const { arr, count, avg } = prepColors(colors);
    u.uColor0.value = arr[0];
    u.uColor1.value = arr[1];
    u.uColor2.value = arr[2];
    u.uColor3.value = arr[3];
    u.uColor4.value = arr[4];
    u.uColor5.value = arr[5];
    u.uColor6.value = arr[6];
    u.uColor7.value = arr[7];
    u.uColorCount.value = count;
    u.uBgColor.value = hexToRGB(backgroundColor);
    u.uMouseColor.value = avg;
    u.uSpeed.value = speed;
    u.uStreakCount.value = Math.max(1, Math.min(16, Math.round(streakCount)));
    u.uStreakWidth.value = streakWidth;
    u.uStreakLength.value = streakLength;
    u.uGlow.value = glow;
    u.uDensity.value = density;
    u.uTwinkle.value = twinkle;
    u.uZoom.value = zoom;
    u.uBgGlow.value = backgroundGlow;
    u.uOpacity.value = opacity;
    u.uMouseEnabled.value = mouseInteraction ? 1 : 0;
    u.uMouseStrength.value = mouseStrength;
    u.uMouseRadius.value = mouseRadius;
    u.uLightMode.value = lightMode ? 1 : 0;
  }, [
    dpr,
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
    lightMode,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${className ?? ""}`}
      style={{
        ...(mixBlendMode && {
          mixBlendMode: mixBlendMode as React.CSSProperties["mixBlendMode"],
        }),
      }}
    />
  );
};

export { Lightfall };
export default Lightfall;
