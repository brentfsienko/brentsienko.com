import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — larger pixel bee on paper. */
export default function AppleIcon() {
  const cells: { x: number; y: number; color: string }[] = [
    { x: 4, y: 0, color: "#8a8a8a" },
    { x: 5, y: 0, color: "#8a8a8a" },
    { x: 6, y: 0, color: "#8a8a8a" },
    { x: 7, y: 0, color: "#8a8a8a" },
    { x: 12, y: 0, color: "#8a8a8a" },
    { x: 13, y: 0, color: "#8a8a8a" },
    { x: 14, y: 0, color: "#8a8a8a" },
    { x: 15, y: 0, color: "#8a8a8a" },
    { x: 2, y: 2, color: "#cfcfcf" },
    { x: 3, y: 2, color: "#cfcfcf" },
    { x: 4, y: 2, color: "#cfcfcf" },
    { x: 5, y: 2, color: "#cfcfcf" },
    { x: 14, y: 2, color: "#cfcfcf" },
    { x: 15, y: 2, color: "#cfcfcf" },
    { x: 16, y: 2, color: "#cfcfcf" },
    { x: 17, y: 2, color: "#cfcfcf" },
  ];

  for (const x of [6, 7, 8, 9, 10, 11, 12, 13]) {
    for (const [y, color] of [
      [4, "#1a1a1a"],
      [5, "#1a1a1a"],
      [6, "#f0c840"],
      [7, "#f0c840"],
      [8, "#1a1a1a"],
      [9, "#1a1a1a"],
      [10, "#f0c840"],
      [11, "#f0c840"],
    ] as const) {
      cells.push({ x, y, color });
    }
  }
  for (const x of [2, 3, 4, 5]) {
    for (const y of [6, 7, 8, 9]) {
      cells.push({ x, y, color: "#1a1a1a" });
    }
  }

  const map = new Map<string, string>();
  for (const c of cells) map.set(`${c.x},${c.y}`, c.color);

  const px = 7;
  const ox = (180 - 20 * px) / 2;
  const oy = (180 - 14 * px) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#f4f2ec",
          display: "flex",
          position: "relative",
        }}
      >
        {[...map.entries()].map(([key, color]) => {
          const [x, y] = key.split(",").map(Number);
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: ox + x * px,
                top: oy + y * px,
                width: px,
                height: px,
                background: color,
              }}
            />
          );
        })}
      </div>
    ),
    { ...size },
  );
}
