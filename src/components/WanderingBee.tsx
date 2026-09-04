"use client";

import { useEffect, useRef, useState } from "react";
import { PixelBee } from "@/components/PixelArt";
import { CritterBubble } from "@/components/CritterBubble";
import { getGeckoPose, onCritterChat, pickPerchQuip, tryStartDuet } from "@/components/critterChat";

type Point = { x: number; y: number };
type Dash = { id: number; x: number; y: number; angle: number };

const BEE_W = 44;
const BEE_H = 32;
const DASH_GAP = 12;
const TRAIL_MS = 1800;
const GECKO_ROOM = 28;

const QUIPS = [
  "leave no trace. take only nectar.",
  "pack it in, pack it out, pollinate in between",
  "stay on the trail. the flowers know the way.",
  "sunrise > alarm clocks",
  "touch grass. then the clover.",
  "hydrate. then hydrate the plants.",
  "trees don't rush. neither should you.",
  "love is a shared patch of sun",
  "find someone who looks at you like a bee looks at lavender",
  "we're all just temporary pollen",
  "nothing matters. the wildflowers still do.",
  "the void is big. so is this oak.",
  "meaning optional. kindness required.",
  "exist softly. buzz loudly.",
  "in the end: compost. until then: bees.",
  "bzzzzz (that's philosophy)",
  "hug a tree. they hold centuries.",
  "good outdoor rule #1: look up",
  "the forest forgives. try it.",
  "love grows where the light does",
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

function entranceEl() {
  return document.getElementById("bee-hive-entrance");
}

export function WanderingBee() {
  const [pos, setPos] = useState<Point>({ x: 80, y: 80 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [visible, setVisible] = useState(true);
  const [quip, setQuip] = useState<string | null>(null);
  const [trail, setTrail] = useState<Dash[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const posRef = useRef(pos);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dashTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dashIdRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const clearTrail = () => {
      for (const t of dashTimeoutsRef.current) clearTimeout(t);
      dashTimeoutsRef.current = [];
      setTrail([]);
    };

    const dropDash = (at: Point, prev: Point) => {
      const dx = at.x - prev.x;
      const dy = at.y - prev.y;
      const id = ++dashIdRef.current;
      const dash: Dash = {
        id,
        x: at.x + BEE_W / 2,
        y: at.y + BEE_H / 2,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI,
      };
      setTrail((cur) => [...cur.slice(-40), dash]);
      const timeout = setTimeout(() => {
        setTrail((cur) => cur.filter((d) => d.id !== id));
        dashTimeoutsRef.current = dashTimeoutsRef.current.filter(
          (t) => t !== timeout,
        );
      }, TRAIL_MS);
      dashTimeoutsRef.current.push(timeout);
    };

    /** Bee top-left so its center lands on the hive entrance hole. */
    const hive = (): Point => {
      const el = entranceEl();
      if (el) {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - BEE_W / 2,
          y: r.top + r.height / 2 - BEE_H / 2,
        };
      }
      const sm = window.innerWidth >= 640;
      const left = sm ? 20 : 12;
      // Approx header content height + border; hive hangs just below the left of the rule
      const headerBottom = 58;
      const hiveW = 64;
      const hiveH = 72;
      const entrX = (14 / 28) * hiveW;
      const entrY = (22 / 32) * hiveH;
      return {
        x: left + entrX - BEE_W / 2,
        y: headerBottom - 2 + entrY - BEE_H / 2,
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

    type TargetKind = "wander" | "hive" | "chat" | "duet" | "chair" | "tree";

    let legsSinceChat = 99;

    const geckoMeet = (): Point => {
      const pose = getGeckoPose();
      if (pose.side === "bottom" || pose.side === "chair" || pose.side === "rock") {
        return { x: pose.x - BEE_W / 2 - 36, y: pose.y - GECKO_ROOM - BEE_H };
      }
      if (pose.side === "right" || pose.side === "tree") {
        return { x: pose.x - BEE_W - 44, y: pose.y - BEE_H / 2 };
      }
      if (pose.side === "left") {
        return { x: pose.x + 36, y: pose.y - BEE_H / 2 };
      }
      return { x: pose.x - BEE_W / 2 - 48, y: pose.y + 28 };
    };

    const chairSpot = (): Point | null => {
      const seat = document.getElementById("home-chair-seat");
      if (!seat) return null;
      const r = seat.getBoundingClientRect();
      if (r.width < 4) return null;
      return {
        x: r.left + r.width / 2 - BEE_W / 2,
        y: r.top - BEE_H - 6,
      };
    };

    const treeSpot = (): Point | null => {
      const tree = document.getElementById("home-tree");
      if (!tree) return null;
      const r = tree.getBoundingClientRect();
      if (r.width < 8) return null;
      return {
        x: r.left - BEE_W - 6,
        y: r.top + r.height * 0.32,
      };
    };

    const pickTarget = (
      from: Point,
      allowHive: boolean,
    ): { point: Point; kind: TargetKind } => {
      const roll = Math.random();
      if (legsSinceChat >= 10 && roll < 0.03) {
        return { point: geckoMeet(), kind: "duet" };
      }
      if (legsSinceChat >= 8 && roll < 0.08) {
        return { point: centerSpot(), kind: "chat" };
      }
      const chair = chairSpot();
      if (chair && roll < 0.12) return { point: chair, kind: "chair" };
      const tree = treeSpot();
      if (tree && roll < 0.18) return { point: tree, kind: "tree" };
      if (allowHive && roll < 0.28) return { point: hive(), kind: "hive" };
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
      let lastDashAt = { ...from };
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
        if (
          Math.hypot(next.x - lastDashAt.x, next.y - lastDashAt.y) >= DASH_GAP
        ) {
          dropDash(next, lastDashAt);
          lastDashAt = { ...next };
        }
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
      if (kind === "chat" || kind === "duet") legsSinceChat = 0;
      else legsSinceChat += 1;

      flyTo(target, () => {
        if (kind === "hive") {
          setVisible(false);
          setQuip(null);
          clearTrail();
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

        if (kind === "duet") {
          tryStartDuet();
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;
            setQuip(null);
            loop();
          }, rand(6200, 7800));
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

        if (kind === "chair" || kind === "tree") {
          setQuip(pickPerchQuip("bee", kind));
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;
            setQuip(null);
            loop();
          }, rand(2800, 4600));
          return;
        }

        timeoutRef.current = setTimeout(loop, rand(200, 900));
      });
    };

    const stopChat = onCritterChat((line) => {
      if (line.from !== "bee") return;
      setQuip(line.text);
    });

    const start = hive();
    posRef.current = start;
    setPos(start);
    setVisible(false);
    setQuip(null);
    clearTrail();
    timeoutRef.current = setTimeout(() => {
      if (cancelled) return;
      justLeftHive = true;
      setVisible(true);
      loop();
    }, rand(800, 1600));

    return () => {
      cancelled = true;
      stopChat();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      for (const t of dashTimeoutsRef.current) clearTimeout(t);
      dashTimeoutsRef.current = [];
    };
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[40] overflow-hidden" aria-hidden>
      {!reducedMotion &&
        trail.map((d) => (
          <div
            key={d.id}
            className="bee-dash"
            style={{
              left: d.x,
              top: d.y,
              transform: `translate(-50%, -50%) rotate(${d.angle}deg)`,
            }}
          />
        ))}

      {!reducedMotion && visible && (
        <div
          className="absolute will-change-transform"
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
        >
          {quip ? (
            <CritterBubble
              who="bee"
              text={quip}
              anchorX={pos.x + BEE_W / 2}
              anchorY={pos.y}
              preferred="above"
            />
          ) : null}
          <PixelBee
            width={BEE_W}
            height={BEE_H}
            className={`!animate-none ${facingLeft ? "-scale-x-100" : ""}`}
          />
        </div>
      )}

      {reducedMotion && (
        <div className="absolute left-[4.5rem] top-[4.25rem]">
          <PixelBee width={36} height={26} className="!animate-none" />
        </div>
      )}
    </div>
  );
}
