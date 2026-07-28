import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — wing, stripes, triangle stinger (no head). */
export default function AppleIcon() {
  const cells: { x: number; y: number; color: string }[] = [
    ...[7, 8, 9, 10, 11, 12].flatMap((x) => [
      { x, y: 0, color: "#8a8a8a" },
      { x, y: 1, color: "#8a8a8a" },
    ]),
    ...[8, 9, 10, 11, 12].flatMap((x) => [
      { x, y: 2, color: "#cfcfcf" },
      { x, y: 3, color: "#cfcfcf" },
    ]),
    { x: 3, y: 6, color: "#1a1a1a" },
    { x: 2, y: 7, color: "#1a1a1a" },
    { x: 3, y: 7, color: "#1a1a1a" },
    { x: 1, y: 8, color: "#1a1a1a" },
    { x: 2, y: 8, color: "#1a1a1a" },
    { x: 3, y: 8, color: "#1a1a1a" },
    { x: 2, y: 9, color: "#1a1a1a" },
    { x: 3, y: 9, color: "#1a1a1a" },
    { x: 3, y: 10, color: "#1a1a1a" },
    ...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#f0c840" })),
    ),
    ...[7, 8].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    ...[11, 12].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
  ];

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
