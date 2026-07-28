import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Pixel bee favicon — one wing, two vertical stripes (same grid as PixelBee). */
export default function Icon() {
  const cells: { x: number; y: number; color: string }[] = [
    // one wing
    ...[8, 9, 10, 11, 12, 13].map((x) => ({ x, y: 0, color: "#8a8a8a" })),
    ...[8, 9, 10, 11, 12, 13].map((x) => ({ x, y: 1, color: "#8a8a8a" })),
    ...[9, 10, 11, 12, 13].map((x) => ({ x, y: 2, color: "#cfcfcf" })),
    ...[9, 10, 11, 12, 13].map((x) => ({ x, y: 3, color: "#cfcfcf" })),
    // head
    ...[2, 3, 4, 5].flatMap((x) =>
      [5, 6, 7, 8, 9].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    // yellow body
    ...[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#f0c840" })),
    ),
    // two vertical stripes
    ...[9, 10].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    ...[13, 14].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    // stinger (small triangle)
    { x: 18, y: 6, color: "#1a1a1a" },
    { x: 18, y: 7, color: "#1a1a1a" },
    { x: 19, y: 7, color: "#1a1a1a" },
    { x: 18, y: 8, color: "#1a1a1a" },
  ];

  const map = new Map<string, string>();
  for (const c of cells) map.set(`${c.x},${c.y}`, c.color);

  const px = 1.4;
  const ox = (32 - 20 * px) / 2;
  const oy = (32 - 14 * px) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
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
