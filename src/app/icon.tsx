import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Pixel bee — triangle stinger (not a black square), head with eye, two stripes. */
export default function Icon() {
  const cells: { x: number; y: number; color: string }[] = [
    // one wing
    ...[7, 8, 9, 10, 11, 12].flatMap((x) => [
      { x, y: 0, color: "#8a8a8a" },
      { x, y: 1, color: "#8a8a8a" },
    ]),
    ...[8, 9, 10, 11, 12].flatMap((x) => [
      { x, y: 2, color: "#cfcfcf" },
      { x, y: 3, color: "#cfcfcf" },
    ]),
    // triangle stinger (where the black square tip used to be)
    { x: 3, y: 6, color: "#1a1a1a" },
    { x: 2, y: 7, color: "#1a1a1a" },
    { x: 3, y: 7, color: "#1a1a1a" },
    { x: 1, y: 8, color: "#1a1a1a" },
    { x: 2, y: 8, color: "#1a1a1a" },
    { x: 3, y: 8, color: "#1a1a1a" },
    { x: 2, y: 9, color: "#1a1a1a" },
    { x: 3, y: 9, color: "#1a1a1a" },
    { x: 3, y: 10, color: "#1a1a1a" },
    // yellow body
    ...[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#f0c840" })),
    ),
    // two vertical stripes
    ...[6, 7].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    ...[10, 11].flatMap((x) =>
      [5, 6, 7, 8, 9, 10].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    // head with eye
    ...[14, 15, 16, 17].flatMap((x) =>
      [5, 6, 7, 8, 9].map((y) => ({ x, y, color: "#1a1a1a" })),
    ),
    { x: 15, y: 6, color: "#f0c840" },
    { x: 16, y: 6, color: "#f0c840" },
    { x: 15, y: 7, color: "#f0c840" },
    { x: 16, y: 7, color: "#f0c840" },
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
