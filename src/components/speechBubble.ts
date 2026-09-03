export type Placement = "above" | "below" | "left" | "right";
export type Box = { left: number; top: number; right: number; bottom: number };

const GAP = 10;
const PAD = 8;
const AVOID = 8;

export function boxFrom(left: number, top: number, w: number, h: number): Box {
  return { left, top, right: left + w, bottom: top + h };
}

export function boxesOverlap(a: Box, b: Box, pad = AVOID) {
  return !(
    a.right + pad <= b.left ||
    a.left - pad >= b.right ||
    a.bottom + pad <= b.top ||
    a.top - pad >= b.bottom
  );
}

function rawPlace(
  ax: number,
  ay: number,
  w: number,
  h: number,
  p: Placement,
) {
  if (p === "above") return { left: ax - w / 2, top: ay - h - GAP };
  if (p === "below") return { left: ax - w / 2, top: ay + GAP };
  if (p === "left") return { left: ax - w - GAP, top: ay - h / 2 };
  return { left: ax + GAP, top: ay - h / 2 };
}

function clampBox(
  left: number,
  top: number,
  w: number,
  h: number,
  vw: number,
  vh: number,
) {
  const maxLeft = Math.max(PAD, vw - PAD - w);
  const maxTop = Math.max(PAD, vh - PAD - h);
  return {
    left: Math.min(Math.max(PAD, left), maxLeft),
    top: Math.min(Math.max(PAD, top), maxTop),
  };
}

const ORDER: Record<Placement, Placement[]> = {
  above: ["above", "below", "left", "right"],
  below: ["below", "above", "right", "left"],
  left: ["left", "right", "above", "below"],
  right: ["right", "left", "above", "below"],
};

function nudgeOff(box: Box, avoid: Box, w: number, h: number, vw: number, vh: number) {
  const overlapX = Math.min(box.right, avoid.right) - Math.max(box.left, avoid.left);
  const overlapY = Math.min(box.bottom, avoid.bottom) - Math.max(box.top, avoid.top);
  let { left, top } = box;

  if (overlapX <= overlapY) {
    if ((box.left + box.right) / 2 <= (avoid.left + avoid.right) / 2) {
      left -= overlapX + AVOID;
    } else {
      left += overlapX + AVOID;
    }
  } else if ((box.top + box.bottom) / 2 <= (avoid.top + avoid.bottom) / 2) {
    top -= overlapY + AVOID;
  } else {
    top += overlapY + AVOID;
  }

  return clampBox(left, top, w, h, vw, vh);
}

function inView(left: number, top: number, w: number, h: number, vw: number, vh: number) {
  return (
    left >= PAD &&
    top >= PAD &&
    left + w <= vw - PAD &&
    top + h <= vh - PAD
  );
}

function inferPlacement(
  ax: number,
  ay: number,
  left: number,
  top: number,
  w: number,
  h: number,
): Placement {
  const dx = left + w / 2 - ax;
  const dy = top + h / 2 - ay;
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "above" : "below";
}

export function placeSpeechBubble(opts: {
  anchorX: number;
  anchorY: number;
  width: number;
  height: number;
  preferred: Placement;
  viewportW: number;
  viewportH: number;
  avoid?: Box | null;
}): { left: number; top: number; placement: Placement } {
  const {
    anchorX,
    anchorY,
    width,
    height,
    preferred,
    viewportW,
    viewportH,
    avoid,
  } = opts;

  const finish = (left: number, top: number, placement: Placement) => ({
    left: Math.round(left),
    top: Math.round(top),
    placement,
  });

  for (const placement of ORDER[preferred]) {
    let { left, top } = rawPlace(anchorX, anchorY, width, height, placement);
    if (!inView(left, top, width, height, viewportW, viewportH)) continue;
    let box = boxFrom(left, top, width, height);

    if (avoid && boxesOverlap(box, avoid)) {
      ({ left, top } = nudgeOff(box, avoid, width, height, viewportW, viewportH));
      box = boxFrom(left, top, width, height);
      if (!inView(left, top, width, height, viewportW, viewportH)) continue;
      if (boxesOverlap(box, avoid)) continue;
    }

    return finish(left, top, placement);
  }

  let { left, top } = rawPlace(anchorX, anchorY, width, height, preferred);
  ({ left, top } = clampBox(left, top, width, height, viewportW, viewportH));
  if (avoid && boxesOverlap(boxFrom(left, top, width, height), avoid)) {
    ({ left, top } = nudgeOff(
      boxFrom(left, top, width, height),
      avoid,
      width,
      height,
      viewportW,
      viewportH,
    ));
  }
  return finish(
    left,
    top,
    inferPlacement(anchorX, anchorY, left, top, width, height),
  );
}
