/** Left/right painted edge of the tree, as a fraction of #home-tree.
 *  t = 0 at the top of the crop, 1 at the ground. From the pixel art, not the box. */
const LEFT: [number, number][] = [
  [0.0, 0.53],
  [0.08, 0.28],
  [0.18, 0.2],
  [0.28, 0.1],
  [0.38, 0.02],
  [0.46, 0.03],
  [0.51, 0.12],
  [0.55, 0.41],
  [0.6, 0.437],
  [0.88, 0.437],
  [0.95, 0.406],
  [1.0, 0.36],
];

const RIGHT: [number, number][] = [
  [0.0, 0.55],
  [0.08, 0.64],
  [0.18, 0.81],
  [0.28, 0.85],
  [0.38, 0.94],
  [0.46, 0.99],
  [0.51, 0.92],
  [0.55, 0.65],
  [0.6, 0.59],
  [0.88, 0.56],
  [0.95, 0.59],
  [1.0, 0.54],
];

export type TreeBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

function lerpProfile(profile: [number, number][], t: number) {
  const u = Math.min(1, Math.max(0, t));
  for (let i = 1; i < profile.length; i++) {
    const [t1, v1] = profile[i]!;
    const [t0, v0] = profile[i - 1]!;
    if (u <= t1) {
      const span = t1 - t0 || 1;
      return v0 + ((v1 - v0) * (u - t0)) / span;
    }
  }
  return profile[profile.length - 1]![1];
}

export function treeT(y: number, tree: TreeBox) {
  if (tree.height <= 0) return 0;
  return (y - tree.top) / tree.height;
}

export function treeEdgeX(
  tree: TreeBox,
  y: number,
  side: "left" | "right" = "left",
) {
  const frac = lerpProfile(side === "left" ? LEFT : RIGHT, treeT(y, tree));
  return tree.left + frac * tree.width;
}

export function treeTrunkX(tree: TreeBox) {
  return treeEdgeX(tree, tree.bottom - 8, "left");
}

/** True if a point sits inside the painted tree (or past it, to the right). */
export function isBehindOrInTree(
  x: number,
  y: number,
  tree: TreeBox | null,
  pad = 8,
) {
  if (!tree) return false;
  if (y < tree.top - 16 || y > tree.bottom + 10) return false;
  if (x < tree.left - 24) return false;
  return x > treeEdgeX(tree, y, "left") - pad;
}

export function readTreeBox(): TreeBox | null {
  const el = document.getElementById("home-tree");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 4 || r.height < 8) return null;
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    width: r.width,
    height: r.height,
  };
}
