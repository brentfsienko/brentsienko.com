"use client";

import { useEffect, useRef, useState } from "react";
import { PixelBee, PixelHive } from "@/components/PixelArt";

type Point = { x: number; y: number };

const BEE_W = 44;
const BEE_H = 32;

const QUIPS = [
  "bzzzzz",
  "where'd i leave my car keys?",
  "this place is kinda cool, eh?",
  "is this organic?",
  "don't mind me",
  "just vibing",
  "ooo shiny",
  "be right back",
  "have you seen my hive?",
  "smells like code in here",
  "one more lap…",
  "hello??",
  "nice fonts",
  "i'm not lost. you're lost.",
  "pollen break",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickQuip() {
  return QUIPS[Math.floor(Math.random() * QUIPS.length)] ?? "bzzzzz";
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function WanderingBee() {
  const [pos, setPos] = useState<Point>({ x: 80, y: 80 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [visible, setVisible] = useState(true);
  const [quip, setQuip] = useState<string | null>(null);
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

    const centerSpot = (): Point => {
      const jitterX = rand(-48, 48);
      const jitterY = rand(-56, 56);
      return {
        x: window.innerWidth / 2 - BEE_W / 2 + jitterX,
        y: window.innerHeight / 2 - BEE_H / 2 + jitterY,
      };
    };

    const randomSpot = (): Point => {
      const pad = 40;
      return {
        x: rand(pad, window.innerWidth - pad - 48),
        y: rand(pad + 48, window.innerHeight - pad - 32),
      };
    };

    type TargetKind = "wander" | "hive" | "chat";

    const pickTarget = (
      from: Point,
      allowHive: boolean,
    ): { point: Point; kind: TargetKind } => {
      const roll = Math.random();
      if (roll < 0.22) return { point: centerSpot(), kind: "chat" };
      if (allowHive && roll < 0.22 + 0.22) return { point: hive(), kind: "hive" };
      let next = randomSpot();
      let tries = 0;
      while (
        tries < 6 &&
        Math.hypot(next.x - from.x, next.y - from.y) < 120
      ) {
        next = randomSpot();
        tries += 1;
      }
      return { point: next, kind: "wander" };
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
      setQuip(null);

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
      const allowHive = !justLeftHive;
      justLeftHive = false;
      const { point: target, kind } = pickTarget(posRef.current, allowHive);

      flyTo(target, () => {
        if (kind === "hive") {
          setVisible(false);
          setQuip(null);
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

        if (kind === "chat") {
          setQuip(pickQuip());
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;
            setQuip(null);
            loop();
          }, rand(3000, 5000));
          return;
        }

        timeoutRef.current = setTimeout(loop, rand(200, 900));
      });
    };

    const start = hive();
    posRef.current = start;
    setPos(start);
    setVisible(false);
    setQuip(null);
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
          {quip ? (
            <div
              className="bee-bubble absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap"
              role="status"
            >
              {quip}
            </div>
          ) : null}
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
