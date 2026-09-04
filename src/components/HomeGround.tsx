"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { PixelBloom, PixelRock } from "@/components/PixelArt";

/** Clip region of /art/tree.svg (viewBox 262.5 × 262.5). */
const TREE_BOX = { left: 19.13, top: 0, width: 193.13, height: 262 };

type Layout = {
  bottom: number;
  treeH: number;
};

export function HomeGround() {
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 56;
      const footerTop =
        footer?.getBoundingClientRect().top ?? window.innerHeight - 36;
      const gap = Math.max(0, footerTop - headerBottom);
      setLayout({
        bottom: Math.max(0, window.innerHeight - footerTop),
        treeH: gap * 0.98,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) ro.observe(header);
    if (footer) ro.observe(footer);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const bottom = layout?.bottom;
  const treeH = layout?.treeH;
  const treeW = treeH != null ? treeH * (TREE_BOX.width / TREE_BOX.height) : undefined;
  const treeVars =
    treeH != null
      ? ({ ["--home-tree-h"]: `${treeH}px` } as CSSProperties)
      : undefined;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[1] flex items-end"
        style={{
          right: "clamp(0.25rem, 1.2vw, 0.75rem)",
          bottom: bottom ?? "var(--site-footer-h)",
        }}
        aria-hidden
      >
        <div
          id="home-chair"
          className="relative z-[1] -mr-2 shrink-0 sm:-mr-3"
        >
          <Image
            src="/art/pixel-chair.png"
            alt=""
            width={1024}
            height={1024}
            className="pixel w-[72px] max-w-none select-none sm:w-[96px] lg:w-[110px]"
            sizes="110px"
          />
          <span
            id="home-chair-seat"
            className="absolute left-[18%] right-[20%] top-[46%] h-px"
          />
        </div>
        <div
          id="home-rock"
          className="relative z-[2] -mr-2 mb-px shrink-0 sm:-mr-3"
        >
          <PixelRock
            width={52}
            height={30}
            className="w-[52px] sm:w-[60px] lg:w-[66px]"
          />
        </div>
        <div
          id="home-tree"
          className="home-tree"
          style={
            treeH != null && treeW != null
              ? { height: treeH, width: treeW, ...treeVars }
              : treeVars
          }
        >
          <img
            src="/art/tree.svg"
            alt=""
            className="pixel max-w-none select-none"
          />
        </div>
      </div>

      <div
        className="home-flowers pointer-events-none fixed z-[2] flex items-end gap-2 sm:gap-4"
        style={{
          left: "var(--site-left)",
          bottom: bottom ?? "var(--site-footer-h)",
        }}
        aria-hidden
      >
        <PixelBloom
          palette="rose"
          shape="heart"
          sway
          width={40}
          height={70}
          className="h-[3.6rem] w-auto sm:h-[4.6rem]"
        />
        <PixelBloom
          palette="gold"
          shape="bench"
          sway
          width={32}
          height={56}
          className="h-[2.8rem] w-auto sm:h-[3.5rem]"
        />
        <PixelBloom
          palette="lilac"
          shape="burst"
          sway
          width={44}
          height={77}
          className="h-[4.2rem] w-auto sm:h-[5.4rem]"
        />
      </div>
    </>
  );
}
