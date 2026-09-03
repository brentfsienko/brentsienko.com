import type { Box } from "@/components/speechBubble";

export type Critter = "bee" | "gecko";
export type ChatLine = { from: Critter; text: string };

const EVENT = "critter-chat";

export const GECKO_QUIPS = [
  "sun on a rock. that's the whole plan.",
  "shed the old skin. keep the good habits.",
  "I'm not lazy. I'm ectothermic.",
  "stillness is a skill. also a nap.",
  "tail optional. dignity required.",
  "climb first. ask gravity later.",
  "my love language is a warm stone.",
  "regrow what you can. leave the rest.",
  "scales, not armor. still soft inside.",
  "blink optional. staring is free.",
  "sticky toes, loose plans.",
  "camouflage is just introversion with better branding.",
  "lick the dew. skip the drama.",
  "four legs, one vibe: clingy.",
  "I don't run. I relocate.",
  "the void is big. this fence post isn't.",
  "trees don't rush. neither do lizards.",
  "ssstay on the trail. or the wall.",
  "good outdoor rule #1: find the sun.",
  "exist softly. cling loudly.",
  "the walls have ears. and now a gecko.",
  "gravity is a suggestion. the corner disagrees.",
];

export const DUETS: [ChatLine, ChatLine][] = [
  [
    { from: "bee", text: "how's the line?" },
    { from: "gecko", text: "supportive. unlike some branches I could name." },
  ],
  [
    { from: "bee", text: "want nectar?" },
    { from: "gecko", text: "I'm more of a cricket guy. but thanks." },
  ],
  [
    { from: "gecko", text: "you're buzzing." },
    { from: "bee", text: "you're barely moving. we balance the ecosystem." },
  ],
  [
    { from: "bee", text: "the flowers say hi." },
    { from: "gecko", text: "tell them I said ssstay hydrated." },
  ],
  [
    { from: "gecko", text: "hive looks cozy." },
    { from: "bee", text: "the line looks... linear. a little jealous." },
  ],
  [
    { from: "bee", text: "pollinate with me." },
    { from: "gecko", text: "I'll stick to the wall. literally." },
  ],
  [
    { from: "gecko", text: "bzzzz is a whole personality." },
    { from: "bee", text: "sss is underrated. respect." },
  ],
  [
    { from: "bee", text: "nothing matters." },
    { from: "gecko", text: "the sun patch still does." },
  ],
  [
    { from: "bee", text: "leave no trace." },
    { from: "gecko", text: "I leave tiny toe prints. sorry." },
  ],
  [
    { from: "gecko", text: "trees don't rush." },
    { from: "bee", text: "I do. that's why I visit." },
  ],
  [
    { from: "bee", text: "touch grass." },
    { from: "gecko", text: "I am touching this entire frame." },
  ],
  [
    { from: "gecko", text: "got any spare warmth?" },
    { from: "bee", text: "I run hot. don't tell the hive." },
  ],
];

export type GeckoSide = "top" | "right" | "bottom" | "left";

let geckoPose = { x: 80, y: 56, side: "top" as GeckoSide };
let chatLock = false;

export function setGeckoPose(pose: { x: number; y: number; side: GeckoSide }) {
  geckoPose = pose;
}

export function getGeckoX() {
  return geckoPose.x;
}

export function getGeckoPose() {
  return geckoPose;
}

export function onCritterChat(cb: (line: ChatLine) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<ChatLine>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

function emit(line: ChatLine) {
  window.dispatchEvent(new CustomEvent<ChatLine>(EVENT, { detail: line }));
}

export function pickGeckoQuip() {
  return GECKO_QUIPS[Math.floor(Math.random() * GECKO_QUIPS.length)] ?? "sss";
}

export function tryStartDuet() {
  if (chatLock) return false;
  const duet = DUETS[Math.floor(Math.random() * DUETS.length)];
  if (!duet) return false;
  chatLock = true;
  emit(duet[0]);
  window.setTimeout(() => {
    emit(duet[1]);
    window.setTimeout(() => {
      chatLock = false;
    }, 3600);
  }, 2300);
  return true;
}

export function isChatBusy() {
  return chatLock;
}

const speechBoxes: Record<Critter, Box | null> = { bee: null, gecko: null };
const speechListeners = new Set<(who: Critter) => void>();

function sameBox(a: Box | null, b: Box | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom
  );
}

export function setSpeechBox(who: Critter, box: Box | null) {
  if (sameBox(speechBoxes[who], box)) return;
  speechBoxes[who] = box;
  speechListeners.forEach((cb) => cb(who));
}

export function getSpeechBox(who: Critter) {
  return speechBoxes[who];
}

export function onSpeechBoxChange(cb: (who: Critter) => void) {
  speechListeners.add(cb);
  return () => {
    speechListeners.delete(cb);
  };
}
