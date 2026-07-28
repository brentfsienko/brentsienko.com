type Props = {
  className?: string;
  width?: number;
  height?: number;
};

/** Pixel-sketch tree — graphite trunk + canopy with a leaf accent. */
export function PixelTree({ className = "", width = 160, height = 200 }: Props) {
  return (
    <svg
      className={`pixel leaf-flicker ${className}`}
      width={width}
      height={height}
      viewBox="0 0 40 50"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* canopy */}
      <rect x="12" y="4" width="16" height="4" fill="#1a1a1a" />
      <rect x="8" y="8" width="24" height="4" fill="#1a1a1a" />
      <rect x="6" y="12" width="28" height="4" fill="#2a2a2a" />
      <rect x="4" y="16" width="32" height="4" fill="#1a1a1a" />
      <rect x="6" y="20" width="28" height="4" fill="#2a2a2a" />
      <rect x="10" y="24" width="20" height="4" fill="#1a1a1a" />
      {/* leaf color hits */}
      <rect x="14" y="10" width="2" height="2" fill="#3d7a4a" className="leaf-flicker" />
      <rect x="22" y="14" width="2" height="2" fill="#3d7a4a" />
      <rect x="10" y="18" width="2" height="2" fill="#3d7a4a" />
      {/* trunk */}
      <rect x="17" y="28" width="6" height="16" fill="#1a1a1a" />
      <rect x="15" y="36" width="2" height="4" fill="#4a4a4a" />
      <rect x="23" y="32" width="2" height="6" fill="#4a4a4a" />
      {/* ground line */}
      <rect x="8" y="44" width="24" height="2" fill="#1a1a1a" />
      <rect x="4" y="46" width="32" height="2" fill="#8a8a8a" />
    </svg>
  );
}

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

export function PixelFlower({ className = "", width = 32, height = 40 }: Props) {
  return (
    <svg
      className={`pixel ${className}`}
      width={width}
      height={height}
      viewBox="0 0 12 16"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <rect x="5" y="0" width="2" height="2" fill="#c43b5a" />
      <rect x="3" y="2" width="2" height="2" fill="#c43b5a" />
      <rect x="7" y="2" width="2" height="2" fill="#c43b5a" />
      <rect x="5" y="2" width="2" height="2" fill="#e8a317" />
      <rect x="1" y="4" width="2" height="2" fill="#c43b5a" />
      <rect x="9" y="4" width="2" height="2" fill="#c43b5a" />
      <rect x="5" y="4" width="2" height="2" fill="#c43b5a" />
      <rect x="5" y="6" width="2" height="8" fill="#3d7a4a" />
      <rect x="3" y="10" width="2" height="2" fill="#3d7a4a" />
      <rect x="7" y="12" width="2" height="2" fill="#3d7a4a" />
    </svg>
  );
}

export function PixelBee({ className = "", width = 40, height = 28 }: Props) {
  return (
    <svg
      className={`pixel bee-fly ${className}`}
      width={width}
      height={height}
      viewBox="0 0 20 14"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* wings */}
      <rect x="4" y="0" width="4" height="2" fill="#8a8a8a" />
      <rect x="12" y="0" width="4" height="2" fill="#8a8a8a" />
      <rect x="2" y="2" width="4" height="2" fill="#cfcfcf" />
      <rect x="14" y="2" width="4" height="2" fill="#cfcfcf" />
      {/* body stripes */}
      <rect x="6" y="4" width="8" height="2" fill="#1a1a1a" />
      <rect x="6" y="6" width="8" height="2" fill="#f0c840" />
      <rect x="6" y="8" width="8" height="2" fill="#1a1a1a" />
      <rect x="6" y="10" width="8" height="2" fill="#f0c840" />
      {/* head */}
      <rect x="2" y="6" width="4" height="4" fill="#1a1a1a" />
    </svg>
  );
}
