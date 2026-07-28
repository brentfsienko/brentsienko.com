type Props = {
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

type FlowerProps = Props & {
  color?: "rose" | "purple" | "amber";
};

const flowerPetal: Record<NonNullable<FlowerProps["color"]>, string> = {
  rose: "#c43b5a",
  purple: "#b8a0d4",
  amber: "#e8a317",
};

/** Ink-sketch tree — organic canopy and trunk, not pixel blocks. */
export function SketchTree({ className = "", width = 280, height = 360 }: Props) {
  return (
    <svg
      className={`leaf-flicker ${className}`}
      width={width}
      height={height}
      viewBox="0 0 200 260"
      fill="none"
      aria-hidden
    >
      {/* ground */}
      <path
        d="M20 238 C60 232 140 232 180 240"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M35 244 C80 248 130 246 165 242"
        stroke="#8a8a8a"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* trunk */}
      <path
        d="M98 230 C96 190 94 150 100 120 C102 108 104 98 102 88"
        stroke="#1a1a1a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M104 228 C106 188 108 152 106 122"
        stroke="#4a4a4a"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* bark hatch */}
      <path d="M96 200 L102 196" stroke="#4a4a4a" strokeWidth="0.8" />
      <path d="M97 180 L104 175" stroke="#4a4a4a" strokeWidth="0.8" />
      <path d="M98 160 L105 156" stroke="#4a4a4a" strokeWidth="0.8" />
      <path d="M99 140 L106 136" stroke="#4a4a4a" strokeWidth="0.8" />

      {/* main branches */}
      <path
        d="M102 100 C80 90 58 78 42 70"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M104 95 C125 85 150 72 168 62"
        stroke="#1a1a1a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M102 115 C75 112 55 118 40 128"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M105 110 C130 108 152 100 170 95"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M101 80 C90 60 85 42 88 28"
        stroke="#1a1a1a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M103 78 C118 58 128 40 132 24"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* canopy masses — overlapping ink blobs */}
      <ellipse cx="70" cy="55" rx="38" ry="32" stroke="#1a1a1a" strokeWidth="1.4" fill="#f4f2ec" />
      <ellipse cx="120" cy="48" rx="42" ry="36" stroke="#1a1a1a" strokeWidth="1.4" fill="#f4f2ec" />
      <ellipse cx="95" cy="72" rx="48" ry="30" stroke="#1a1a1a" strokeWidth="1.4" fill="#f4f2ec" />
      <ellipse cx="55" cy="85" rx="28" ry="22" stroke="#1a1a1a" strokeWidth="1.2" fill="#f4f2ec" />
      <ellipse cx="140" cy="80" rx="30" ry="24" stroke="#1a1a1a" strokeWidth="1.2" fill="#f4f2ec" />
      <ellipse cx="100" cy="30" rx="26" ry="20" stroke="#1a1a1a" strokeWidth="1.2" fill="#f4f2ec" />

      {/* leaf texture lines */}
      <path d="M50 50 C58 45 66 48 72 42" stroke="#2a2a2a" strokeWidth="0.7" opacity="0.6" />
      <path d="M85 38 C95 32 105 36 115 30" stroke="#2a2a2a" strokeWidth="0.7" opacity="0.6" />
      <path d="M60 75 C72 70 84 74 96 68" stroke="#2a2a2a" strokeWidth="0.7" opacity="0.5" />
      <path d="M110 70 C122 64 134 68 148 62" stroke="#2a2a2a" strokeWidth="0.7" opacity="0.5" />

      {/* green leaf accents */}
      <ellipse cx="62" cy="58" rx="4" ry="6" fill="#3d7a4a" opacity="0.85" transform="rotate(-20 62 58)" />
      <ellipse cx="128" cy="42" rx="4" ry="6" fill="#3d7a4a" opacity="0.75" transform="rotate(25 128 42)" />
      <ellipse cx="95" cy="55" rx="3.5" ry="5" fill="#4a8f58" opacity="0.8" transform="rotate(10 95 55)" />
      <ellipse cx="145" cy="78" rx="3.5" ry="5" fill="#3d7a4a" opacity="0.7" transform="rotate(-15 145 78)" />
    </svg>
  );
}

/**
 * Pixel tree — same crispEdges / rect style as the bee & hive.
 * Wide layered canopy, thick trunk, wrapping vine, hanging vines, spreading roots.
 */
export function PixelTree({ className = "", width = 320, height = 360 }: Props) {
  const G = "#3d7a4a";
  const G2 = "#4a8f58";
  const G3 = "#2d5a38";
  const G4 = "#5fa86c";
  const B = "#8b6914";
  const B2 = "#6b4f12";
  const B3 = "#c4a35a";
  const Ink = "#1a1a1a";

  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 64 72"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* ── canopy: stacked cloud tiers (top → bottom) ── */}
      <rect x="18" y="2" width="22" height="3" fill={G4} />
      <rect x="14" y="4" width="30" height="3" fill={G2} />
      <rect x="10" y="6" width="16" height="4" fill={G} />
      <rect x="24" y="6" width="22" height="4" fill={G2} />
      <rect x="8" y="9" width="20" height="4" fill={G3} />
      <rect x="26" y="9" width="24" height="4" fill={G} />
      <rect x="6" y="12" width="18" height="4" fill={G2} />
      <rect x="22" y="12" width="14" height="4" fill={G4} />
      <rect x="34" y="12" width="18" height="4" fill={G2} />
      <rect x="4" y="15" width="22" height="4" fill={G} />
      <rect x="24" y="15" width="28" height="4" fill={G3} />
      <rect x="2" y="18" width="16" height="4" fill={G3} />
      <rect x="16" y="18" width="20" height="4" fill={G2} />
      <rect x="34" y="18" width="20" height="4" fill={G} />
      <rect x="6" y="21" width="18" height="3" fill={G} />
      <rect x="22" y="21" width="16" height="3" fill={G3} />
      <rect x="36" y="21" width="16" height="3" fill={G2} />
      {/* canopy outline ticks */}
      <rect x="18" y="1" width="4" height="1" fill={Ink} />
      <rect x="36" y="1" width="4" height="1" fill={Ink} />
      <rect x="2" y="17" width="2" height="2" fill={Ink} />
      <rect x="52" y="17" width="2" height="2" fill={Ink} />

      {/* ── hanging vines from canopy ── */}
      <rect x="8" y="24" width="1" height="8" fill={G3} />
      <rect x="7" y="30" width="3" height="1" fill={G} />
      <rect x="14" y="24" width="1" height="6" fill={G3} />
      <rect x="13" y="29" width="3" height="1" fill={G} />
      <rect x="14" y="30" width="1" height="4" fill={G3} />
      <rect x="40" y="24" width="1" height="10" fill={G3} />
      <rect x="39" y="32" width="3" height="1" fill={G} />
      <rect x="40" y="33" width="1" height="3" fill={G3} />
      <rect x="48" y="24" width="1" height="7" fill={G3} />
      <rect x="47" y="29" width="3" height="1" fill={G} />
      <rect x="48" y="30" width="1" height="5" fill={G3} />

      {/* ── trunk ── */}
      <rect x="28" y="24" width="8" height="6" fill={B} />
      <rect x="27" y="30" width="10" height="8" fill={B2} />
      <rect x="28" y="38" width="8" height="10" fill={B} />
      <rect x="27" y="48" width="10" height="8" fill={B2} />
      <rect x="29" y="26" width="2" height="28" fill={B3} />
      <rect x="34" y="32" width="2" height="20" fill={Ink} opacity="0.35" />

      {/* vine wrapping trunk */}
      <rect x="26" y="34" width="4" height="2" fill={G} />
      <rect x="30" y="36" width="4" height="2" fill={G2} />
      <rect x="34" y="38" width="4" height="2" fill={G} />
      <rect x="28" y="42" width="4" height="2" fill={G3} />
      <rect x="26" y="46" width="4" height="2" fill={G} />
      <rect x="30" y="48" width="5" height="2" fill={G2} />

      {/* ── roots ── */}
      <rect x="24" y="56" width="16" height="3" fill={B2} />
      <rect x="20" y="58" width="10" height="3" fill={B} />
      <rect x="34" y="58" width="12" height="3" fill={B2} />
      <rect x="14" y="60" width="12" height="3" fill={B2} />
      <rect x="36" y="60" width="14" height="3" fill={B} />
      <rect x="8" y="62" width="14" height="3" fill={B} />
      <rect x="28" y="62" width="10" height="3" fill={B2} />
      <rect x="42" y="62" width="12" height="3" fill={B2} />
      <rect x="4" y="64" width="12" height="3" fill={B2} />
      <rect x="18" y="64" width="10" height="3" fill={B} />
      <rect x="34" y="64" width="10" height="3" fill={B} />
      <rect x="48" y="64" width="10" height="3" fill={B} />
      <rect x="2" y="66" width="8" height="3" fill={B} />
      <rect x="12" y="66" width="6" height="2" fill={B2} />
      <rect x="40" y="66" width="8" height="2" fill={B2} />
      <rect x="52" y="66" width="8" height="3" fill={B2} />
      {/* root tips */}
      <rect x="1" y="68" width="4" height="2" fill={Ink} />
      <rect x="20" y="67" width="3" height="2" fill={Ink} />
      <rect x="44" y="67" width="3" height="2" fill={Ink} />
      <rect x="58" y="68" width="4" height="2" fill={Ink} />
    </svg>
  );
}

/** @deprecated — prefer PixelTree for the site scene */
export const PixelTreeSketch = SketchTree;

export function PixelSun({ className = "", width = 48, height = 48 }: Props) {
  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="6" y="0" width="4" height="2" fill="#e8a317" />
      <rect x="0" y="6" width="2" height="4" fill="#e8a317" />
      <rect x="14" y="6" width="2" height="4" fill="#e8a317" />
      <rect x="6" y="14" width="4" height="2" fill="#e8a317" />
      <rect x="2" y="2" width="2" height="2" fill="#e8a317" />
      <rect x="12" y="2" width="2" height="2" fill="#e8a317" />
      <rect x="2" y="12" width="2" height="2" fill="#e8a317" />
      <rect x="12" y="12" width="2" height="2" fill="#e8a317" />
      <rect x="4" y="4" width="8" height="8" fill="#e8a317" />
      <rect x="6" y="6" width="4" height="4" fill="#f4f2ec" />
    </svg>
  );
}

export function PixelFlower({
  className = "",
  width = 32,
  height = 40,
  color = "rose",
}: FlowerProps) {
  const petal = flowerPetal[color];
  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 12 16"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="5" y="0" width="2" height="2" fill={petal} />
      <rect x="3" y="2" width="2" height="2" fill={petal} />
      <rect x="7" y="2" width="2" height="2" fill={petal} />
      <rect x="5" y="2" width="2" height="2" fill="#e8a317" />
      <rect x="1" y="4" width="2" height="2" fill={petal} />
      <rect x="9" y="4" width="2" height="2" fill={petal} />
      <rect x="5" y="4" width="2" height="2" fill={petal} />
      <rect x="5" y="6" width="2" height="8" fill="#3d7a4a" />
      <rect x="3" y="10" width="2" height="2" fill="#3d7a4a" />
      <rect x="7" y="12" width="2" height="2" fill="#3d7a4a" />
    </svg>
  );
}

export function PixelBee({ className = "", width = 40, height = 28 }: Props) {
  return (
    <svg
      className={`pixel ${className.includes("bee-fly") || className.includes("!animate-none") ? className : `bee-fly ${className}`}`}
      width={width}
      height={height}
      viewBox="0 0 20 14"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* one wing */}
      <rect x="7" y="0" width="6" height="2" fill="#8a8a8a" />
      <rect x="8" y="2" width="5" height="2" fill="#cfcfcf" />
      {/* triangle stinger */}
      <polygon points="4,6 1,8 4,10" fill="#1a1a1a" />
      {/* yellow body */}
      <rect x="4" y="5" width="12" height="6" fill="#f0c840" />
      {/* two vertical stripes */}
      <rect x="7" y="5" width="2" height="6" fill="#1a1a1a" />
      <rect x="11" y="5" width="2" height="6" fill="#1a1a1a" />
    </svg>
  );
}

/** Pixel beehive for the wandering bee. */
export function PixelHive({ className = "", width = 56, height = 64 }: Props) {
  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 28 32"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* hanging branch */}
      <rect x="10" y="0" width="8" height="2" fill="#4a4a4a" />
      <rect x="12" y="2" width="4" height="2" fill="#1a1a1a" />
      {/* hive tiers */}
      <rect x="8" y="4" width="12" height="3" fill="#e8a317" />
      <rect x="6" y="7" width="16" height="3" fill="#f0c840" />
      <rect x="4" y="10" width="20" height="4" fill="#e8a317" />
      <rect x="3" y="14" width="22" height="4" fill="#f0c840" />
      <rect x="4" y="18" width="20" height="4" fill="#e8a317" />
      <rect x="6" y="22" width="16" height="3" fill="#f0c840" />
      <rect x="8" y="25" width="12" height="3" fill="#d4920f" />
      {/* entrance */}
      <rect x="12" y="20" width="4" height="4" fill="#1a1a1a" />
      {/* outline ticks */}
      <rect x="4" y="10" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="10" width="2" height="2" fill="#1a1a1a" />
      <rect x="3" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="23" y="16" width="2" height="2" fill="#1a1a1a" />
    </svg>
  );
}

/** Green gecko perched on a small rock. */
export function PixelGecko({ className = "", width = 72, height = 48 }: Props) {
  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 36 24"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* rock */}
      <rect x="4" y="16" width="28" height="4" fill="#6b6b6b" />
      <rect x="8" y="14" width="20" height="2" fill="#8a8a8a" />
      <rect x="12" y="12" width="12" height="2" fill="#7a7a7a" />
      <rect x="6" y="20" width="4" height="2" fill="#5a5a5a" />
      <rect x="26" y="20" width="4" height="2" fill="#5a5a5a" />

      {/* gecko body */}
      <rect x="10" y="8" width="14" height="4" fill="#3d9a60" />
      <rect x="12" y="6" width="10" height="2" fill="#4cb574" />
      {/* head */}
      <rect x="22" y="6" width="6" height="4" fill="#3d9a60" />
      <rect x="26" y="6" width="2" height="2" fill="#1a1a1a" />
      {/* eye */}
      <rect x="25" y="7" width="1" height="1" fill="#f4f2ec" />
      {/* legs */}
      <rect x="12" y="12" width="2" height="3" fill="#2f7a4a" />
      <rect x="16" y="12" width="2" height="3" fill="#2f7a4a" />
      <rect x="20" y="12" width="2" height="3" fill="#2f7a4a" />
      {/* tail */}
      <rect x="6" y="8" width="4" height="2" fill="#3d9a60" />
      <rect x="4" y="6" width="2" height="2" fill="#4cb574" />
      <rect x="2" y="4" width="2" height="2" fill="#3d9a60" />
    </svg>
  );
}
