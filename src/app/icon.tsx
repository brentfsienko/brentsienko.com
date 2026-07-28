import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Pixel bee favicon (same grid as PixelBee). */
export default function Icon() {
  const cells: { x: number; y: number; color: string }[] = [
    // wings
    { x: 4, y: 0, color: "#8a8a8a" },
    { x: 5, y: 0, color: "#8a8a8a" },
    { x: 12, y: 0, color: "#8a8a8a" },
    { x: 13, y: 0, color: "#8a8a8a" },
    { x: 2, y: 2, color: "#cfcfcf" },
    { x: 3, y: 2, color: "#cfcfcf" },
    { x: 14, y: 2, color: "#cfcfcf" },
    { x: 15, y: 2, color: "#cfcfcf" },
    // body stripes (2px tall rows)
    ...[4, 5, 6, 7, 8, 9, 10, 11].flatMap((x) => [
      { x, y: 4, color: "#1a1a1a" },
      { x, y: 5, color: "#1a1a1a" },
      { x, y: 6, color: "#f0c840" },
      { x, y: 7, color: "#f0c840" },
      { x, y: 8, color: "#1a1a1a" },
      { x, y: 9, color: "#1a1a1a" },
      { x, y: 10, color: "#f0c840" },
      { x, y: 11, color: "#f0c840" },
    ]),
    // head
    ...[2, 3, 4, 5].flatMap((x) => [
      { x, y: 6, color: "#1a1a1a" },
      { x, y: 7, color: "#1a1a1a" },
      { x, y: 8, color: "#1a1a1a" },
      { x, y: 9, color: "#1a1a1a" },
    ]),
  ];

  // Dedupe by last-write (head overwrites body)
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
