"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Critter } from "@/components/critterChat";
import {
  boxFrom,
  placeSpeechBubble,
  type Box,
  type Placement,
} from "@/components/speechBubble";
import { getSpeechBox, onSpeechBoxChange, setSpeechBox } from "@/components/critterChat";

type Props = {
  who: Critter;
  text: string;
  anchorX: number;
  anchorY: number;
  preferred: Placement;
  /** Keep the bubble off this box (usually the speaker's sprite). */
  keepClear?: Box | null;
};

export function CritterBubble({ who, text, anchorX, anchorY, preferred, keepClear }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, placement: preferred });
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const layout = () => {
      const el = ref.current;
      if (!el) return;
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const other = who === "bee" ? getSpeechBox("gecko") : getSpeechBox("bee");
      const avoid = [keepClear, other].filter((box): box is Box => box != null);
      const next = placeSpeechBubble({
        anchorX,
        anchorY,
        width,
        height,
        preferred,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        avoid,
      });
      setPos(next);
      setReady(true);
      setSpeechBox(who, boxFrom(next.left, next.top, width, height));
    };

    layout();
    const stop = onSpeechBoxChange((changed) => {
      if (who === "bee" && changed === "gecko") layout();
    });
    window.addEventListener("resize", layout);
    return () => {
      stop();
      window.removeEventListener("resize", layout);
      setSpeechBox(who, null);
    };
  }, [who, text, anchorX, anchorY, preferred, keepClear, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      className="bee-bubble pointer-events-none"
      data-tail={pos.placement}
      role="status"
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        zIndex: 50,
        visibility: ready ? "visible" : "hidden",
      }}
    >
      {text}
    </div>,
    document.body,
  );
}
