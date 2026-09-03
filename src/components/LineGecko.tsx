"use client";

import { useEffect, useRef, useState } from "react";
import { PixelLineGecko } from "@/components/PixelArt";
import {
  isChatBusy,
  onCritterChat,
  pickGeckoQuip,
  setGeckoPose,
  tryStartDuet,
  type GeckoSide,
} from "@/components/critterChat";

const GECKO_W = 58;
const GECKO_H = 24;
const HALF_W = GECKO_W / 2;

type Metrics = { top: number; bottom: number; w: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function measure(): Metrics {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  return {
    top: header?.getBoundingClientRect().bottom ?? 56,
    bottom: footer?.getBoundingClientRect().top ?? window.innerHeight - 36,
    w: window.innerWidth,
  };
}

function bounds(m: Metrics, side: GeckoSide) {
  if (side === "top" || side === "bottom") {
    return { min: HALF_W, max: Math.max(HALF_W + 8, m.w - HALF_W) };
  }
  return { min: m.top, max: Math.max(m.top + 8, m.bottom) };
}

function turnCorner(
  side: GeckoSide,
  dir: number,
  m: Metrics,
): { side: GeckoSide; along: number; dir: number } {
  if (side === "top" && dir > 0) return { side: "right", along: m.top, dir: 1 };
  if (side === "top" && dir < 0) return { side: "left", along: m.top, dir: 1 };
  if (side === "right" && dir > 0)
    return { side: "bottom", along: m.w - HALF_W, dir: -1 };
  if (side === "right" && dir < 0)
    return { side: "top", along: m.w - HALF_W, dir: -1 };
  if (side === "bottom" && dir > 0)
    return { side: "right", along: m.bottom, dir: -1 };
  if (side === "bottom" && dir < 0)
    return { side: "left", along: m.bottom, dir: -1 };
  if (side === "left" && dir > 0)
    return { side: "bottom", along: HALF_W, dir: 1 };
  return { side: "top", along: HALF_W, dir: 1 };
}

function feet(side: GeckoSide, along: number, m: Metrics) {
  if (side === "top") return { x: along, y: m.top };
  if (side === "bottom") return { x: along, y: m.bottom };
  if (side === "right") return { x: m.w - 2, y: along };
  return { x: 2, y: along };
}

function wallTransform(side: GeckoSide, dir: number) {
  const face = dir > 0 ? 1 : -1;
  if (side === "left") return `rotate(90deg) scaleX(${face})`;
  if (side === "right") return `rotate(-90deg) scaleX(${-face})`;
  return `scaleX(${face})`;
}

function bubbleShift(side: GeckoSide) {
  if (side === "right") return "translate(calc(-100% - 10px), -50%)";
  if (side === "left") return "translate(10px, -50%)";
  return "translate(-50%, calc(-100% - 8px))";
}

export function LineGecko() {
  const [along, setAlong] = useState(80);
  const [side, setSide] = useState<GeckoSide>("top");
  const [dir, setDir] = useState(1);
  const [step, setStep] = useState<0 | 1>(0);
  const [quip, setQuip] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    top: 56,
    bottom: 800,
    w: 1200,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const alongRef = useRef(80);
  const sideRef = useRef<GeckoSide>("top");
  const dirRef = useRef(1);
  const metricsRef = useRef(metrics);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkingRef = useRef(true);

  useEffect(() => {
    const apply = () => {
      const m = measure();
      metricsRef.current = m;
      setMetrics(m);
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const publish = () => {
      const m = metricsRef.current;
      const at = feet(sideRef.current, alongRef.current, m);
      setGeckoPose({ ...at, side: sideRef.current });
    };

    const showQuip = (text: string, ms: number) => {
      setQuip(text);
      if (quipTimeoutRef.current) clearTimeout(quipTimeoutRef.current);
      quipTimeoutRef.current = setTimeout(() => setQuip(null), ms);
    };

    const stopChat = onCritterChat((line) => {
      if (line.from !== "gecko") {
        walkingRef.current = false;
        return;
      }
      walkingRef.current = false;
      showQuip(line.text, 3400);
    });

    let cancelled = false;
    let last = performance.now();
    let speed = rand(16, 28);
    let stepAcc = 0;

    const applyMetrics = () => {
      const m = measure();
      metricsRef.current = m;
      setMetrics(m);
      const { min, max } = bounds(m, sideRef.current);
      alongRef.current = Math.min(max, Math.max(min, alongRef.current));
      setAlong(alongRef.current);
      publish();
    };
    applyMetrics();

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (walkingRef.current) {
        const m = metricsRef.current;
        const { min, max } = bounds(m, sideRef.current);
        let next = alongRef.current + dirRef.current * speed * dt;
        if (next > max || next < min) {
          if (Math.random() < 0.55) {
            const turned = turnCorner(sideRef.current, dirRef.current, m);
            sideRef.current = turned.side;
            dirRef.current = turned.dir;
            alongRef.current = turned.along;
            setSide(turned.side);
            setDir(turned.dir);
          } else {
            alongRef.current = next > max ? min : max;
          }
        } else {
          alongRef.current = next;
        }
        setAlong(alongRef.current);
        publish();
        stepAcc += dt;
        if (stepAcc > 0.22) {
          stepAcc = 0;
          setStep((s) => (s === 0 ? 1 : 0));
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (cancelled) return;
      if (isChatBusy()) {
        walkingRef.current = false;
        timeoutRef.current = setTimeout(schedule, rand(800, 1400));
        return;
      }

      const roll = Math.random();
      if (roll < 0.18) {
        walkingRef.current = false;
        if (roll < 0.07 && tryStartDuet()) {
          timeoutRef.current = setTimeout(schedule, rand(6200, 7600));
          return;
        }
        if (roll < 0.14) {
          showQuip(pickGeckoQuip(), rand(2800, 4200));
        }
        timeoutRef.current = setTimeout(schedule, rand(900, 2400));
        return;
      }
      if (roll < 0.32) {
        dirRef.current *= -1;
        setDir(dirRef.current);
      }
      walkingRef.current = true;
      speed = rand(16, 30);
      timeoutRef.current = setTimeout(schedule, rand(900, 3800));
    };

    dirRef.current = Math.random() < 0.5 ? -1 : 1;
    setDir(dirRef.current);
    alongRef.current = rand(80, Math.max(120, window.innerWidth - 80));
    setAlong(alongRef.current);
    publish();
    rafRef.current = requestAnimationFrame(tick);
    timeoutRef.current = setTimeout(schedule, rand(600, 1600));

    window.addEventListener("resize", applyMetrics);

    return () => {
      cancelled = true;
      stopChat();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (quipTimeoutRef.current) clearTimeout(quipTimeoutRef.current);
      window.removeEventListener("resize", applyMetrics);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none fixed z-[19]"
        style={{ left: "4.5rem", top: metrics.top - GECKO_H }}
        aria-hidden
      >
        <PixelLineGecko width={GECKO_W} height={GECKO_H} />
      </div>
    );
  }

  const at = feet(side, along, metrics);
  const layer = side === "top" ? 19 : 32;

  return (
    <div
      className="pointer-events-none fixed"
      style={{ left: at.x, top: at.y, width: 0, height: 0, zIndex: layer }}
      aria-hidden
    >
      {quip ? (
        <div
          className="bee-bubble absolute z-[33] whitespace-nowrap"
          style={{ transform: bubbleShift(side) }}
          role="status"
        >
          {quip}
        </div>
      ) : null}
      <div
        style={{
          width: GECKO_W,
          height: GECKO_H,
          marginLeft: -HALF_W,
          marginTop: -GECKO_H,
          transform: wallTransform(side, dir),
          transformOrigin: "50% 100%",
        }}
      >
        <PixelLineGecko width={GECKO_W} height={GECKO_H} step={step} />
      </div>
    </div>
  );
}
