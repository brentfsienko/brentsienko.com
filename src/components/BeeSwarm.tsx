import { PixelBee } from "@/components/PixelArt";

type BeeSpec = {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  flip?: boolean;
};

const bees: BeeSpec[] = [
  { top: "8%", left: "6%", size: 36, delay: "0s", duration: "3.2s" },
  { top: "14%", left: "22%", size: 48, delay: "0.4s", duration: "4.1s" },
  { top: "6%", left: "48%", size: 32, delay: "1.1s", duration: "3.6s", flip: true },
  { top: "18%", left: "72%", size: 52, delay: "0.2s", duration: "4.8s" },
  { top: "12%", left: "88%", size: 28, delay: "1.8s", duration: "3s", flip: true },
  { top: "32%", left: "10%", size: 44, delay: "0.7s", duration: "4.4s", flip: true },
  { top: "28%", left: "38%", size: 38, delay: "1.4s", duration: "3.8s" },
  { top: "36%", left: "58%", size: 56, delay: "0.1s", duration: "5s" },
  { top: "30%", left: "82%", size: 34, delay: "2.1s", duration: "3.4s", flip: true },
  { top: "48%", left: "4%", size: 30, delay: "0.9s", duration: "4.2s" },
  { top: "52%", left: "28%", size: 50, delay: "1.6s", duration: "3.7s", flip: true },
  { top: "46%", left: "52%", size: 40, delay: "0.3s", duration: "4.6s" },
  { top: "54%", left: "74%", size: 46, delay: "1.2s", duration: "3.9s" },
  { top: "50%", left: "92%", size: 26, delay: "2.4s", duration: "3.1s", flip: true },
  { top: "68%", left: "14%", size: 42, delay: "0.5s", duration: "4.3s", flip: true },
  { top: "72%", left: "42%", size: 36, delay: "1.9s", duration: "3.5s" },
  { top: "66%", left: "64%", size: 54, delay: "0.8s", duration: "5.2s", flip: true },
  { top: "74%", left: "86%", size: 32, delay: "1.5s", duration: "3.3s" },
  { top: "84%", left: "8%", size: 28, delay: "2s", duration: "4s" },
  { top: "88%", left: "34%", size: 44, delay: "0.6s", duration: "4.7s", flip: true },
  { top: "82%", left: "58%", size: 38, delay: "1.3s", duration: "3.6s" },
  { top: "90%", left: "78%", size: 48, delay: "0.15s", duration: "4.9s" },
  { top: "22%", left: "15%", size: 24, delay: "2.6s", duration: "2.8s" },
  { top: "62%", left: "48%", size: 30, delay: "2.2s", duration: "3.2s", flip: true },
];

export function BeeSwarm({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {bees.map((bee, i) => (
        <div
          key={i}
          className={`absolute bee-fly ${bee.flip ? "-scale-x-100" : ""}`}
          style={{
            top: bee.top,
            left: bee.left,
            animationDelay: bee.delay,
            animationDuration: bee.duration,
          }}
        >
          <PixelBee
            width={bee.size}
            height={Math.round(bee.size * 0.7)}
            className="!animate-none"
          />
        </div>
      ))}
    </div>
  );
}
