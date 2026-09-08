"use client";

import { useEffect, useRef, useState } from "react";
import { PixelBee } from "@/components/PixelArt";
import { CritterBubble } from "@/components/CritterBubble";
import {
  getGeckoPose,
  isChatBusy,
  onCritterChat,
  pickBeeQuip,
  pickPerchQuip,
  tryStartDuet,
} from "@/components/critterChat";
import {
  isBehindOrInTree,
  readTreeBox,
  treeEdgeX,
  type TreeBox,
} from "@/components/treeSilhouette";

type Point = { x: number; y: number };
type Dash = { id: number; x: number; y: number; angle: number };

const BEE_W = 44;
const BEE_H = 32;
const DASH_GAP = 12;
const TRAIL_MS = 1800;
const GECKO_ROOM = 28;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
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

    const keepInFront = (p: Point, tree: TreeBox | null): Point => {
      if (!tree) return p;
      const cy = p.y + BEE_H / 2;
      if (cy < tree.top - 20 || cy > tree.bottom + 12) return p;
      const maxX = treeEdgeX(tree, cy, "left") - BEE_W - 6;
      if (p.x > maxX) return { x: maxX, y: p.y };
      return p;
    };

    const centerSpot = (): Point => {
      const jitterX = rand(-48, 48);
      const jitterY = rand(-56, 56);
      return keepInFront(
        {
          x: window.innerWidth / 2 - BEE_W / 2 + jitterX,
          y: window.innerHeight / 2 - BEE_H / 2 + jitterY,
        },
        readTreeBox(),
      );
    };

    const randomSpot = (): Point => {
      const pad = 40;
      const tree = readTreeBox();
      const maxX = tree
        ? Math.max(pad, treeEdgeX(tree, tree.top + tree.height * 0.38, "left") - BEE_W - 16)
        : window.innerWidth - pad - 48;
      let next = {
        x: rand(pad, maxX),
        y: rand(pad + 48, window.innerHeight - pad - 32),
      };
      let tries = 0;
      while (tries < 8 && isBehindOrInTree(next.x + BEE_W / 2, next.y + BEE_H / 2, tree)) {
        next = {
          x: rand(pad, maxX),
          y: rand(pad + 48, window.innerHeight - pad - 32),
        };
        tries += 1;
      }
      return keepInFront(next, tree);
    };

    type TargetKind = "wander" | "hive" | "chat" | "duet" | "chair" | "tree";

    let legsSinceChat = 99;
    let lastBeeSpeech = 0;
    let holdUntil = 0;
    let docked = true;
    let flightGen = 0;
    const SPEECH_COOLDOWN_MS = 22_000;

    const beeCanBanter = () => Date.now() - lastBeeSpeech > SPEECH_COOLDOWN_MS;

    const abortFlight = () => {
      flightGen += 1;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const geckoMeet = (): Point => {
      const pose = getGeckoPose();
      const tree = readTreeBox();
      let meet: Point;
      if (pose.side === "bottom" || pose.side === "chair" || pose.side === "rock") {
        meet = { x: pose.x - BEE_W / 2 - 36, y: pose.y - GECKO_ROOM - BEE_H };
      } else if (pose.side === "right" || pose.side === "tree") {
        meet = { x: pose.x - BEE_W - 44, y: pose.y - BEE_H / 2 };
      } else if (pose.side === "left") {
        meet = { x: pose.x + 36, y: pose.y - BEE_H / 2 };
      } else {
        meet = { x: pose.x - BEE_W / 2 - 48, y: pose.y + 28 };
      }
      return keepInFront(meet, tree);
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
      const tree = readTreeBox();
      if (!tree) return null;
      const y = tree.top + tree.height * 0.34;
      return keepInFront(
        {
          x: treeEdgeX(tree, y, "left") - BEE_W - 10,
          y: y - BEE_H / 2,
        },
        tree,
      );
    };

    const pickTarget = (
      from: Point,
      allowHive: boolean,
    ): { point: Point; kind: TargetKind } => {
      const roll = Math.random();
      const chatty = beeCanBanter();
      if (chatty && legsSinceChat >= 18 && roll < 0.012) {
        return { point: geckoMeet(), kind: "duet" };
      }
      if (chatty && legsSinceChat >= 14 && roll < 0.035) {
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
    let loop: () => void = () => {};

    const resumeWhenQuiet = () => {
      if (cancelled || docked) return;
      const left = holdUntil - Date.now();
      if (left > 50 || isChatBusy()) {
        timeoutRef.current = setTimeout(resumeWhenQuiet, Math.max(left, 400));
        return;
      }
      setQuip(null);
      loop();
    };

    const holdHere = (ms: number) => {
      abortFlight();
      holdUntil = Math.max(holdUntil, Date.now() + ms);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(resumeWhenQuiet, holdUntil - Date.now());
    };

    const flyTo = (to: Point, onDone: () => void) => {
      const gen = ++flightGen;
      const from = { ...posRef.current };
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const duration = Math.min(5200, Math.max(1800, dist * 8 + rand(400, 1200)));
      const start = performance.now();
      const wobbleAmp = 8 + Math.random() * 12;
      const wobbleFreq = 2.5 + Math.random() * 2;
      let lastDashAt = { ...from };
      setFacingLeft(to.x < from.x);
      setVisible(true);
      setQuip(null);

      const tick = (now: number) => {
        if (cancelled || gen !== flightGen) return;
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOut(t);
        const envelope = Math.sin(t * Math.PI);
        const wobble = Math.sin(t * Math.PI * wobbleFreq) * wobbleAmp * envelope;
        const next = keepInFront(
          {
            x: from.x + (to.x - from.x) * e,
            y: from.y + (to.y - from.y) * e + wobble,
          },
          readTreeBox(),
        );
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

    loop = () => {
      if (cancelled) return;
      const allowHive = !justLeftHive;
      justLeftHive = false;
      const { point: target, kind } = pickTarget(posRef.current, allowHive);
      if (kind === "chat" || kind === "duet") legsSinceChat = 0;
      else legsSinceChat += 1;

      flyTo(target, () => {
        if (kind === "hive") {
          docked = true;
          setVisible(false);
          setQuip(null);
          clearTrail();
          const dock = hive();
          posRef.current = dock;
          setPos(dock);
          timeoutRef.current = setTimeout(() => {
            if (cancelled) return;
            docked = false;
            justLeftHive = true;
            setVisible(true);
            loop();
          }, rand(1800, 4200));
          return;
        }

        if (kind === "duet") {
          lastBeeSpeech = Date.now();
          tryStartDuet();
          holdHere(rand(6200, 7800));
          return;
        }

        if (kind === "chat") {
          lastBeeSpeech = Date.now();
          setQuip(pickBeeQuip());
          holdHere(rand(3200, 5200));
          return;
        }

        if (kind === "chair" || kind === "tree") {
          if (beeCanBanter() && Math.random() < 0.22) {
            lastBeeSpeech = Date.now();
            setQuip(pickPerchQuip("bee", kind));
            holdHere(rand(2800, 4600));
          } else {
            holdHere(rand(700, 1600));
          }
          return;
        }

        timeoutRef.current = setTimeout(loop, rand(200, 900));
      });
    };

    const stopChat = onCritterChat((line) => {
      if (cancelled || docked || line.from !== "bee") return;
      lastBeeSpeech = Date.now();
      setQuip(line.text);
      holdHere(rand(3200, 4200));
    });

    const start = hive();
    posRef.current = start;
    setPos(start);
    setVisible(false);
    setQuip(null);
    docked = true;
    clearTrail();
    timeoutRef.current = setTimeout(() => {
      if (cancelled) return;
      docked = false;
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
          <div className={quip ? undefined : "bee-hover"}>
            <PixelBee
              width={BEE_W}
              height={BEE_H}
              className={`!animate-none ${facingLeft ? "-scale-x-100" : ""}`}
            />
          </div>
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
