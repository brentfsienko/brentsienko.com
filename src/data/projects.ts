export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  liveUrl: string;
  repoUrl: string | null;
  stack: string[];
};

export const projects: Project[] = [
  {
    slug: "sudoku",
    name: "Sudoku",
    tagline: "Co-op and competitive Sudoku with real-time rooms.",
    description:
      "A dog-themed Sudoku game built with Next.js. Play solo across five difficulties, or join a friend over Wi-Fi in co-op or competitive mode. Real-time presence and shared boards run on Liveblocks; optional Supabase auth syncs stats across devices.",
    liveUrl: "https://sudoku-lac-nine.vercel.app",
    repoUrl: "https://github.com/brentfsienko/sudoku",
    stack: ["Next.js", "Liveblocks", "Supabase", "TypeScript"],
  },
  {
    slug: "benchmark",
    name: "Benchmark",
    tagline: "A mobile-first PWA for discovering and logging park benches.",
    description:
      "Explore benches on a map, log visits, follow an activity feed, and chase challenges. Built as a Next.js PWA with Supabase (PostGIS), Leaflet maps, and auth. Live at benchmark.rest.",
    liveUrl: "https://benchmark.rest",
    repoUrl: null,
    stack: ["Next.js", "Supabase", "Leaflet", "PWA"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
