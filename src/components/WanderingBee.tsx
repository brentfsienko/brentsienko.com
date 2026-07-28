"use client";

import { useEffect, useRef, useState } from "react";
import { PixelBee, PixelHive } from "@/components/PixelArt";

type Point = { x: number; y: number };

const BEE_W = 44;
const BEE_H = 32;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function WanderingBee() {
  const [pos, setPos] = useState<Point>({ x: 80, y: 80 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const posRef = useRef(pos);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entranceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    /** Bee top-left so its center lands on the hive entrance hole. */
    const hive = (): Point => {
      const el = entranceRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - BEE_W / 2,
          y: r.top + r.height / 2 - BEE_H / 2,
        };
      }
      // Fallback: entrance is ~mid-lower on the hive, not the top.
      const w = window.innerWidth;
      const sm = w >= 640;
      const right = sm ? 20 : 12;
      const top = sm ? 64 : 56;
      const hiveW = 64;
      const hiveH = 72;
      const entrX = (14 / 28) * hiveW;
      const entrY = (22 / 32) * hiveH;
      return {
        x: w - right - hiveW + entrX - BEE_W / 2,
        y: top + entrY - BEE_H / 2,
      };
    };

    const randomSpot = (): Point => {
      const pad = 40;
      return {
        x: rand(pad, window.innerWidth - pad - 48),
        y: rand(pad + 48, window.innerHeight - pad - 32),
      };
    };

    const pickTarget = (from: Point, allowHive: boolean): Point => {
      if (allowHive && Math.random() < 0.28) return hive();
      let next = randomSpot();
      let tries = 0;
      while (
        tries < 6 &&
        Math.hypot(next.x - from.x, next.y - from.y) < 120
      ) {
        next = randomSpot();
        tries += 1;
      }
      return next;
    };

    let cancelled = false;
    let justLeftHive = true;

    const flyTo = (to: Point, onDone: () => void) => {
      const from = { ...posRef.current };
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const duration = Math.min(5200, Math.max(1800, dist * 8 + rand(400, 1200)));
      const start = performance.now();
      const wobbleAmp = 8 + Math.random() * 12;
      const wobbleFreq = 2.5 + Math.random() * 2;
      setFacingLeft(to.x < from.x);
      setVisible(true);

      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOut(t);
        const envelope = Math.sin(t * Math.PI);
        const wobble = Math.sin(t * Math.PI * wobbleFreq) * wobbleAmp * envelope;
        const next = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e + wobble,
        };
        posRef.current = next;
        setPos(next);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          onDone();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const loop = () => {
      if (cancelled) return;
      const hivePos = hive();
      const allowHive = !justLeftHive;
      justLeftHive = false;
      const target = pickTarget(posRef.current, allowHive);
      const landingAtHive =
        Math.hypot(target.x - hivePos.x, target.y - hivePos.y) < 24;

      flyTo(target, () => {
        if (landingAtHive) {
          // Duck into the entrance hole, then emerge later.
          setVisible(false);
          const dock = hive();
          posRef.current = dock;
          setPos(dock);
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;
            justLeftHive = true;
            setVisible(true);
            loop();
          }, rand(1800, 4200));
          return;
        }
        timeoutRef.current = setTimeout(loop, rand(200, 900));
      });
    };

    // Start already tucked in the hive, then emerge from the hole.
    const start = hive();
    posRef.current = start;
    setPos(start);
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      if (cancelled) return;
      justLeftHive = true;
      setVisible(true);
      loop();
    }, rand(800, 1600));

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden" aria-hidden>
      <div className="absolute right-3 top-14 sm:right-5 sm:top-16">
        <div className="relative" style={{ width: 64, height: 72 }}>
          <PixelHive width={64} height={72} />
          {/* Entrance hole marker — viewBox (12–16, 20–24) on 28×32 grid */}
          <span
            ref={entranceRef}
            className="absolute"
            style={{
              left: `${(14 / 28) * 100}%`,
              top: `${(22 / 32) * 100}%`,
              width: 8,
              height: 8,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      </div>

      {!reducedMotion && visible && (
        <div
          className="absolute will-change-transform"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
        >
          <PixelBee
            width={BEE_W}
            height={BEE_H}
            className={`!animate-none ${facingLeft ? "-scale-x-100" : ""}`}
          />
        </div>
      )}

      {reducedMotion && (
        <div className="absolute right-[4.5rem] top-[5.75rem]">
          <PixelBee width={36} height={26} className="!animate-none" />
        </div>
      )}
    </div>
  );
}
