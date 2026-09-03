"use client";

import { useEffect, useRef, useState } from "react";
import { PixelLineGecko } from "@/components/PixelArt";
import {
  isChatBusy,
  onCritterChat,
  pickGeckoQuip,
  setGeckoX,
  tryStartDuet,
} from "@/components/critterChat";

const GECKO_W = 58;
const GECKO_H = 24;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function wrapX(x: number, width: number) {
  const span = width + GECKO_W;
  let next = x;
  while (next > width) next -= span;
  while (next < -GECKO_W) next += span;
  return next;
}

export function LineGecko() {
  const [x, setX] = useState(80);
  const [facingLeft, setFacingLeft] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);
  const [quip, setQuip] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const xRef = useRef(80);
  const dirRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkingRef = useRef(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

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

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (walkingRef.current) {
        const next = wrapX(
          xRef.current + dirRef.current * speed * dt,
          window.innerWidth,
        );
        xRef.current = next;
        setGeckoX(next);
        setX(next);
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
      if (roll < 0.22) {
        walkingRef.current = false;
        if (roll < 0.08 && tryStartDuet()) {
          timeoutRef.current = setTimeout(schedule, rand(6200, 7600));
          return;
        }
        if (roll < 0.16) {
          showQuip(pickGeckoQuip(), rand(2800, 4200));
        }
        timeoutRef.current = setTimeout(schedule, rand(900, 2400));
        return;
      }
      if (roll < 0.38) {
        dirRef.current *= -1;
        setFacingLeft(dirRef.current < 0);
      }
      walkingRef.current = true;
      speed = rand(16, 30);
      timeoutRef.current = setTimeout(schedule, rand(900, 3800));
    };

    dirRef.current = Math.random() < 0.5 ? -1 : 1;
    setFacingLeft(dirRef.current < 0);
    xRef.current = rand(24, Math.max(80, window.innerWidth - 80));
    setGeckoX(xRef.current);
    setX(xRef.current);
    rafRef.current = requestAnimationFrame(tick);
    timeoutRef.current = setTimeout(schedule, rand(600, 1600));

    const onResize = () => {
      xRef.current = wrapX(xRef.current, window.innerWidth);
      setGeckoX(xRef.current);
      setX(xRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      stopChat();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (quipTimeoutRef.current) clearTimeout(quipTimeoutRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none absolute z-[21]"
        style={{ left: "4.5rem", bottom: 0 }}
        aria-hidden
      >
        <PixelLineGecko width={GECKO_W} height={GECKO_H} />
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute z-[21]"
      style={{
        left: x,
        bottom: 0,
        width: GECKO_W,
        height: GECKO_H,
      }}
      aria-hidden
    >
      {quip ? (
        <div
          className="bee-bubble absolute bottom-full left-1/2 z-[30] mb-2 -translate-x-1/2"
          role="status"
        >
          {quip}
        </div>
      ) : null}
      <PixelLineGecko
        width={GECKO_W}
        height={GECKO_H}
        step={step}
        className={facingLeft ? "-scale-x-100" : ""}
      />
    </div>
  );
}
