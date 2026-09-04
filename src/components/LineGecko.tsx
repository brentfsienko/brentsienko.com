"use client";

import { useEffect, useRef, useState } from "react";
import { PixelLineGecko } from "@/components/PixelArt";
import { CritterBubble } from "@/components/CritterBubble";
import type { Placement } from "@/components/speechBubble";
import {
  isChatBusy,
  onCritterChat,
  pickGeckoQuip,
  pickPerchQuip,
  setGeckoPose,
  tryStartDuet,
  type GeckoSide,
} from "@/components/critterChat";
import { treeEdgeX, treeTrunkX } from "@/components/treeSilhouette";

const GECKO_W = 58;
const GECKO_H = 24;
const HALF_W = GECKO_W / 2;

type Metrics = { top: number; bottom: number; w: number };

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

type Scene = Metrics & {
  tree: Rect | null;
  chair: Rect | null;
  seat: Rect | null;
  rock: Rect | null;
  rockTop: Rect | null;
};

function readRect(id: string): Rect | null {
  const el = document.getElementById(id);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 1) return null;
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  };
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

function scene(): Scene {
  return {
    ...measure(),
    tree: readRect("home-tree"),
    chair: readRect("home-chair"),
    seat: readRect("home-chair-seat"),
    rock: readRect("home-rock"),
    rockTop: readRect("home-rock-top"),
  };
}

function usable(r: Rect | null) {
  return r != null;
}

function bounds(side: GeckoSide, s: Scene) {
  if (side === "top" || side === "bottom") {
    return { min: HALF_W, max: Math.max(HALF_W + 8, s.w - HALF_W) };
  }
  if (side === "left" || side === "right") {
    return { min: s.top, max: Math.max(s.top + 8, s.bottom) };
  }
  if (side === "tree" && s.tree) {
    return { min: s.tree.top + 18, max: s.tree.bottom - 6 };
  }
  if (side === "chair" && s.chair) {
    return { min: s.chair.left + 10, max: s.chair.right - 10 };
  }
  if (side === "rock" && s.rock) {
    return { min: s.rock.left + 8, max: s.rock.right - 8 };
  }
  return { min: HALF_W, max: Math.max(HALF_W + 8, s.w - HALF_W) };
}

function turnCorner(
  side: GeckoSide,
  dir: number,
  s: Scene,
): { side: GeckoSide; along: number; dir: number } {
  if (side === "top" && dir > 0) return { side: "right", along: s.top, dir: 1 };
  if (side === "top" && dir < 0) return { side: "left", along: s.top, dir: 1 };
  if (side === "right" && dir > 0)
    return { side: "bottom", along: s.w - HALF_W, dir: -1 };
  if (side === "right" && dir < 0)
    return { side: "top", along: s.w - HALF_W, dir: -1 };
  if (side === "bottom" && dir > 0)
    return { side: "right", along: s.bottom, dir: -1 };
  if (side === "bottom" && dir < 0)
    return { side: "left", along: s.bottom, dir: -1 };
  if (side === "left" && dir > 0)
    return { side: "bottom", along: HALF_W, dir: 1 };
  if (side === "left") return { side: "top", along: HALF_W, dir: 1 };
  if (side === "tree") {
    return {
      side: "bottom",
      along: s.tree ? treeTrunkX(s.tree) : s.w - HALF_W,
      dir: -1,
    };
  }
  if (side === "chair") {
    const x = dir > 0 ? (s.chair?.right ?? s.w / 2) : (s.chair?.left ?? s.w / 2);
    return { side: "bottom", along: x, dir };
  }
  const x = dir > 0 ? (s.rock?.right ?? s.w / 2) : (s.rock?.left ?? s.w / 2);
  return { side: "bottom", along: x, dir };
}

function perchAt(along: number, s: Scene): "chair" | "tree" | "rock" | null {
  if (s.chair && along > s.chair.left + 6 && along < s.chair.right - 6) return "chair";
  if (s.rock && along > s.rock.left + 4 && along < s.rock.right - 4) return "rock";
  if (s.tree && Math.abs(along - treeTrunkX(s.tree)) < 22) return "tree";
  return null;
}

function availableSides(s: Scene): GeckoSide[] {
  const sides: GeckoSide[] = ["top", "right", "bottom", "left"];
  if (usable(s.tree)) sides.push("tree");
  if (usable(s.chair)) sides.push("chair");
  if (usable(s.rock)) sides.push("rock");
  return sides;
}

function feet(side: GeckoSide, along: number, s: Scene) {
  if (side === "top") return { x: along, y: s.top };
  if (side === "bottom") return { x: along, y: s.bottom };
  if (side === "right") return { x: s.w - 2, y: along };
  if (side === "left") return { x: 2, y: along };
  if (side === "tree") {
    return {
      x: s.tree ? treeEdgeX(s.tree, along, "left") : s.w - 180,
      y: along,
    };
  }
  if (side === "chair") {
    const seatY = s.seat?.top ?? (s.chair ? s.chair.top + s.chair.height * 0.46 : s.bottom - 36);
    return { x: along, y: seatY };
  }
  return {
    x: along,
    y: s.rockTop?.top ?? (s.rock?.top ?? s.bottom - 18) + 4,
  };
}

function wallTransform(side: GeckoSide, dir: number) {
  const face = dir > 0 ? 1 : -1;
  if (side === "left") return `rotate(90deg) scaleX(${face})`;
  if (side === "right" || side === "tree") return `rotate(-90deg) scaleX(${-face})`;
  if (side === "rock") return `scaleX(${face})`;
  return `scaleX(${face})`;
}

function geckoBubble(side: GeckoSide, at: { x: number; y: number }) {
  if (side === "top") {
    return { anchorX: at.x, anchorY: at.y, preferred: "below" as Placement };
  }
  if (side === "bottom" || side === "chair" || side === "rock") {
    return {
      anchorX: at.x,
      anchorY: at.y - GECKO_H,
      preferred: "above" as Placement,
    };
  }
  if (side === "right" || side === "tree") {
    return {
      anchorX: at.x - 6,
      anchorY: at.y - GECKO_H / 2,
      preferred: "left" as Placement,
    };
  }
  return {
    anchorX: at.x + 6,
    anchorY: at.y - GECKO_H / 2,
    preferred: "right" as Placement,
  };
}

export function LineGecko() {
  const [along, setAlong] = useState(80);
  const [side, setSide] = useState<GeckoSide>("top");
  const [dir, setDir] = useState(1);
  const [step, setStep] = useState<0 | 1>(0);
  const [quip, setQuip] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Scene>({
    top: 56,
    bottom: 800,
    w: 1200,
    tree: null,
    chair: null,
    seat: null,
    rock: null,
    rockTop: null,
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
      const s = scene();
      metricsRef.current = s;
      setMetrics(s);
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
      const s = scene();
      metricsRef.current = s;
      setMetrics(s);
      const here = sideRef.current;
      if (
        (here === "tree" && !s.tree) ||
        (here === "chair" && !s.chair) ||
        (here === "rock" && !s.rock)
      ) {
        sideRef.current = "bottom";
        setSide("bottom");
      }
      const { min, max } = bounds(sideRef.current, s);
      alongRef.current = Math.min(max, Math.max(min, alongRef.current));
      setAlong(alongRef.current);
      publish();
    };
    applyMetrics();

    let perchAcc = 0;

    const hopOnto = (next: "chair" | "tree" | "rock", s: Scene) => {
      sideRef.current = next;
      setSide(next);
      if (next === "tree" && s.tree) {
        alongRef.current = s.tree.bottom - 12;
        dirRef.current = -1;
        setDir(-1);
      } else {
        const { min, max } = bounds(next, s);
        alongRef.current = Math.min(max, Math.max(min, alongRef.current));
      }
      setAlong(alongRef.current);
      walkingRef.current = false;
      showQuip(pickPerchQuip("gecko", next), rand(2800, 4400));
      publish();
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = scene();
      metricsRef.current = s;

      if (walkingRef.current) {
        if (sideRef.current === "bottom") {
          perchAcc += dt;
          if (perchAcc > 0.65) {
            perchAcc = 0;
            const hop = perchAt(alongRef.current, s);
            if (hop && Math.random() < 0.38) {
              hopOnto(hop, s);
              rafRef.current = requestAnimationFrame(tick);
              return;
            }
          }
        }

        const { min, max } = bounds(sideRef.current, s);
        const next = alongRef.current + dirRef.current * speed * dt;
        if (next > max || next < min) {
          if (sideRef.current === "tree" || sideRef.current === "chair" || sideRef.current === "rock") {
            const turned = turnCorner(sideRef.current, dirRef.current, s);
            sideRef.current = turned.side;
            dirRef.current = turned.dir;
            alongRef.current = turned.along;
            setSide(turned.side);
            setDir(turned.dir);
          } else if (Math.random() < 0.55) {
            const turned = turnCorner(sideRef.current, dirRef.current, s);
            sideRef.current = turned.side;
            dirRef.current = turned.dir;
            alongRef.current = turned.along;
            setSide(turned.side);
            setDir(turned.dir);
          } else {
            alongRef.current = next > max ? max : min;
          }
        } else {
          alongRef.current = next;
        }
        setAlong(alongRef.current);
        publish();
        stepAcc += dt;
        if (stepAcc > 0.22) {
          stepAcc = 0;
          setStep((step) => (step === 0 ? 1 : 0));
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

      const here = sideRef.current;
      const s = metricsRef.current;
      const roll = Math.random();

      if (here === "chair" || here === "rock") {
        if (roll < 0.55) {
          walkingRef.current = false;
          if (roll < 0.18) {
            showQuip(pickPerchQuip("gecko", here), rand(2600, 4000));
          }
          timeoutRef.current = setTimeout(schedule, rand(2200, 4800));
          return;
        }
        const turned = turnCorner(here, dirRef.current, s);
        sideRef.current = turned.side;
        dirRef.current = turned.dir;
        alongRef.current = turned.along;
        setSide(turned.side);
        setDir(turned.dir);
        setAlong(turned.along);
        walkingRef.current = true;
        publish();
        timeoutRef.current = setTimeout(schedule, rand(900, 2800));
        return;
      }

      if (here === "tree") {
        if (roll < 0.22) {
          walkingRef.current = false;
          showQuip(pickPerchQuip("gecko", "tree"), rand(2600, 4000));
          timeoutRef.current = setTimeout(schedule, rand(2800, 5000));
          return;
        }
        walkingRef.current = true;
        if (roll < 0.45) {
          dirRef.current *= -1;
          setDir(dirRef.current);
        }
        speed = rand(14, 26);
        timeoutRef.current = setTimeout(schedule, rand(1200, 3600));
        return;
      }

      if (roll < 0.16) {
        walkingRef.current = false;
        if (roll < 0.02 && tryStartDuet()) {
          timeoutRef.current = setTimeout(schedule, rand(6200, 7600));
          return;
        }
        if (roll < 0.07) {
          showQuip(pickGeckoQuip(), rand(2800, 4200));
        }
        timeoutRef.current = setTimeout(schedule, rand(1600, 3600));
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

    const boot = () => {
      if (cancelled) return;
      const s = scene();
      metricsRef.current = s;
      setMetrics(s);
      const sides = availableSides(s);
      const start = sides[Math.floor(Math.random() * sides.length)] ?? "top";
      const { min, max } = bounds(start, s);
      sideRef.current = start;
      alongRef.current = rand(min, max);
      dirRef.current = Math.random() < 0.5 ? -1 : 1;
      setSide(start);
      setAlong(alongRef.current);
      setDir(dirRef.current);
      if (start === "chair" || start === "tree" || start === "rock") {
        walkingRef.current = false;
        showQuip(pickPerchQuip("gecko", start), rand(2800, 4200));
      } else {
        walkingRef.current = true;
      }
      publish();
    };

    timeoutRef.current = setTimeout(boot, 80);
    rafRef.current = requestAnimationFrame(tick);
    const startLoop = window.setTimeout(() => {
      if (!cancelled) timeoutRef.current = setTimeout(schedule, rand(800, 1800));
    }, 200);

    window.addEventListener("resize", applyMetrics);

    return () => {
      cancelled = true;
      stopChat();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (quipTimeoutRef.current) clearTimeout(quipTimeoutRef.current);
      window.clearTimeout(startLoop);
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
        <CritterBubble
          who="gecko"
          text={quip}
          {...geckoBubble(side, at)}
        />
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
