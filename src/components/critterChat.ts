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
  "if I fall I was already practicing a new perspective.",
  "patience is a metabolism.",
  "I collected this sunbeam. it's mine.",
  "no thoughts. just toes. just wall.",
  "horizontal is a myth I reject.",
  "I have seen things. mostly flies. still counts.",
  "cold blood. warm opinions.",
  "the ceiling is just a floor with commitment issues.",
  "do not tap the glass. I live here.",
  "molting is rebranding. I'm in my second era.",
  "I am 12% lizard, 88% nap logistics.",
  "if you need me I'll be exactly here.",
  "the wind can try. my toes have a union.",
  "night shift for moths. day shift for me. the wall never clocks out.",
  "I don't chase. I wait. the sun comes to me.",
  "tiny dinosaur. huge afternoon.",
  "my five-year plan is this afternoon and then another one.",
  "silence is a habitat.",
  "I licked a window once. 7/10. too honest.",
  "corners are just hugs that architecture invented.",
  "if stillness were a sport I'd be banned for being too good.",
  "I didn't get lost. I got vertical.",
  "the paint job is excellent. very grippy. compliments to the house.",
  "some people journal. I cling and think about flies.",
  "low heart rate. high standards for rocks.",
  "I contain multitudes. most of them are naps.",
  "please hold. I am photosynthesizing. wait. wrong kingdom. still holding.",
  "the best view is the one you don't have to climb down from.",
  "I am the quiet in the room. also the surprise on the lamp.",
  "scales catch light like gossip catches a porch.",
  "today's mood: sun-drunk and structurally sound.",
  "I practiced disappearing. then I practiced being here anyway.",
  "a good wall asks for nothing and gives me everything.",
  "tail stored separately. personality fully assembled.",
  "I move like a rumor: slowly, then all at once, then not at all.",
  "the frame is a trail if you believe in it.",
  "I have opinions about shade. they're all positive.",
  "nobody panic. I meant to be upside down.",
  "this is my Ted Talk. it's just sss and then a blink.",
];

export const BEE_QUIPS = [
  "leave no trace. take only nectar.",
  "pack it in, pack it out, pollinate in between",
  "stay on the trail. the flowers know the way.",
  "sunrise > alarm clocks",
  "touch grass. then the clover.",
  "hydrate. then hydrate the plants.",
  "trees don't rush. neither should you.",
  "love is a shared patch of sun",
  "find someone who looks at you like a bee looks at lavender",
  "we're all just temporary pollen",
  "nothing matters. the wildflowers still do.",
  "the void is big. so is this oak.",
  "meaning optional. kindness required.",
  "exist softly. buzz loudly.",
  "in the end: compost. until then: bees.",
  "bzzzzz (that's philosophy)",
  "hug a tree. they hold centuries.",
  "good outdoor rule #1: look up",
  "the forest forgives. try it.",
  "love grows where the light does",
  "I clock in at dawn. the flowers already know.",
  "six legs, one job, infinite clover.",
  "the hive said teamwork. I said also this dandelion.",
  "if you're lost, follow the hum. then the yellow.",
  "nectar is a love letter with calories.",
  "I don't do small talk. I do stamens.",
  "the sky is a commute. I like my commute.",
  "busy is a brand. I'm just hungry and devoted.",
  "pollen on the pants. that's how you know it's a good day.",
  "I visited 40 flowers before lunch. they all said thanks.",
  "the wind tried to unionize me. I kept flying.",
  "soft body. loud wings. that's the mix.",
  "I believe in leftovers: extra bloom, extra chance.",
  "if the world ends, plant something first.",
  "my therapist is a patch of mint.",
  "no map. just smell and hope and lift.",
  "the sun is a meeting I actually attend.",
  "I carry gossip from rose to rose. all of it is sweet.",
  "you can sit with me. I only sting if the vibe is corporate.",
  "the clover does not care about your inbox.",
  "I packed a picnic. it's just me and a whole meadow.",
  "wings are a prayer you can hear.",
  "today I learned a new flower. we are now friends.",
  "the hive is home. the field is church.",
  "I outran a thought. it was about winter. not today.",
  "yellow is a warning and a welcome. I am both.",
  "please don't mow. I'm in the middle of a sentence.",
  "I don't chase trends. I chase thyme.",
  "a good life: lift, sip, leave more than you took.",
  "the air is thick with yes if you listen.",
  "I kept a little pollen behind my ear for later.",
  "the world is loud. flowers are specific.",
  "I am small and the work is huge and that's fine.",
  "if you need a sign, it's the bee. hi. go outside.",
  "bzzzz is just how I say I love you to a field.",
  "I don't do weekends. every bloom is a holiday.",
  "the trail is whatever the next flower decides.",
  "I brought you a rumor: the lilac is incredible this year.",
  "rest is for moths. kidding. I hover-nap.",
  "one sip. then another. that's a practice.",
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
  [
    { from: "bee", text: "you ever fly?" },
    { from: "gecko", text: "I fall with style. doesn't count." },
  ],
  [
    { from: "gecko", text: "slow down." },
    { from: "bee", text: "can't. there's a dandelion with my name on it." },
  ],
  [
    { from: "bee", text: "the void is big." },
    { from: "gecko", text: "so is this wall. pick a scale." },
  ],
  [
    { from: "gecko", text: "do you ever sit?" },
    { from: "bee", text: "hovering is sitting for people with wings." },
  ],
  [
    { from: "bee", text: "need a lift?" },
    { from: "gecko", text: "I am the lift. I'm already up here." },
  ],
  [
    { from: "gecko", text: "your trail is dashed." },
    { from: "bee", text: "yours is a smear of determination." },
  ],
  [
    { from: "bee", text: "the oak says take your time." },
    { from: "gecko", text: "finally. someone who gets me." },
  ],
  [
    { from: "gecko", text: "is the hive unionized?" },
    { from: "bee", text: "we're a cooperative. also a cloud with opinions." },
  ],
  [
    { from: "bee", text: "you look like a comma." },
    { from: "gecko", text: "you look like a deadline. we should hang out." },
  ],
  [
    { from: "gecko", text: "I found the sun." },
    { from: "bee", text: "I found the flowers using the sun. teamwork." },
  ],
  [
    { from: "bee", text: "pack it out." },
    { from: "gecko", text: "I packed in a whole lizard. still here." },
  ],
  [
    { from: "gecko", text: "your wings are showing off." },
    { from: "bee", text: "your toes are showing on. different sport." },
  ],
  [
    { from: "bee", text: "want to hear the clover gossip?" },
    { from: "gecko", text: "only if it's slow enough to cling to." },
  ],
  [
    { from: "gecko", text: "night's coming." },
    { from: "bee", text: "then I'm going home. you can keep the wall." },
  ],
  [
    { from: "bee", text: "this website has a gecko." },
    { from: "gecko", text: "this gecko has a website. don't make it weird." },
  ],
  [
    { from: "gecko", text: "I could live in that hive." },
    { from: "bee", text: "you would nap through the entire honey season." },
  ],
  [
    { from: "bee", text: "exist softly." },
    { from: "gecko", text: "already on it. been on it. will remain on it." },
  ],
  [
    { from: "gecko", text: "what's the rush?" },
    { from: "bee", text: "winter. also joy. also that lavender." },
  ],
  [
    { from: "bee", text: "I brought you a flower report." },
    { from: "gecko", text: "condense it to: warm, or not warm." },
  ],
  [
    { from: "gecko", text: "you missed a spot." },
    { from: "bee", text: "that's tomorrow's flower. I left it on purpose." },
  ],
];

export type GeckoSide = "top" | "right" | "bottom" | "left" | "tree" | "chair" | "rock";

let geckoPose = { x: 80, y: 56, side: "top" as GeckoSide };
let chatLock = false;
let duetCooldownUntil = 0;

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

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
  }
  return next;
}

const bags = new Map<string, unknown[]>();
const lastPicked = new Map<string, unknown>();

function pickFrom<T>(key: string, lines: T[], fallback: T): T {
  let bag = bags.get(key) as T[] | undefined;
  if (!bag || bag.length === 0) {
    bag = shuffle(lines);
    const last = lastPicked.get(key);
    if (bag.length > 1 && bag[bag.length - 1] === last) {
      const swap = bag[0]!;
      bag[0] = bag[bag.length - 1]!;
      bag[bag.length - 1] = swap;
    }
    bags.set(key, bag as unknown[]);
  }
  const next = bag.pop() ?? fallback;
  lastPicked.set(key, next);
  return next;
}

export function pickGeckoQuip() {
  return pickFrom("gecko", GECKO_QUIPS, "sss");
}

export function pickBeeQuip() {
  return pickFrom("bee", BEE_QUIPS, "bzzzzz");
}

export const CHAIR_QUIPS: Record<Critter, string[]> = {
  gecko: [
    "this chair gets it. warm. still. mine now.",
    "I would like to formally move in.",
    "finally, a rock with a backrest.",
    "don't get up. I live here now.",
    "ergonomic? I don't know that word. I know nap.",
    "this seat has tenure. I am the new hire.",
    "if the chair is taken, the taker is me.",
    "a throne for a very small king.",
    "I sat. the day improved immediately.",
    "furniture was invented for lizards. humans just got there first.",
    "do not adjust. I am the lumbar support now.",
    "warm wood. kind angles. I accept this life.",
    "the chair and I have an understanding: nobody moves.",
    "I will pay rent in stillness.",
  ],
  bee: [
    "ok this chair is a whole vibe.",
    "nectar can wait. this seat cannot.",
    "I like this chair. don't tell the hive I sat.",
    "six legs, one cushion. generous.",
    "I hovered. then I committed. growth.",
    "this is not in the handbook. I am taking a personal day.",
    "the flowers can see me. I don't care. this chair rules.",
    "landing gear: deployed. dignity: optional.",
    "I will tell the hive it was research.",
    "soft. still. illegal for bees. anyway.",
    "if anyone asks, I was checking for pollen. there is none. I remain.",
    "a throne with no meetings. I could live here.",
  ],
};

export const TREE_QUIPS: Record<Critter, string[]> = {
  gecko: [
    "this bark has excellent grip. five stars.",
    "a vertical nap. ambitious.",
    "the tree doesn't rush. I'm practicing.",
    "sticky toes, better real estate.",
    "I climbed it because it was there. and warm.",
    "the tree and I are in a long meeting about nothing.",
    "rings inside. naps outside. we both keep time slowly.",
    "I chose the shady side. I'm not a hero.",
    "bark is just a wall that grew up right.",
    "if I fall, the moss will write a kind review.",
    "this is the original skyscraper. I'm on floor three of leaf.",
    "the tree asked nothing. I gave it a gecko anyway.",
    "hold still, oak. that's my line.",
    "I can hear the sap thinking. it's very calm in there.",
  ],
  bee: [
    "I like this tree. don't tell the flowers.",
    "the tree smells like a good year.",
    "leaves, shade, and nobody asking me to pollinate immediately.",
    "hug a tree. they hold centuries. also me, briefly.",
    "this is the original airport. I'm just visiting.",
    "the canopy is a ceiling I respect.",
    "I left pollen on the bark. a gift. a mess. both.",
    "old wood, new buzz. we can share.",
    "if the meadow is closed, I take meetings in the oak.",
    "the tree doesn't clock in. I'm trying that.",
    "shade is nectar for people who don't drink nectar. lucky gecko.",
    "I circled it three times. that's how you say hello to an oak.",
  ],
};

export const ROCK_QUIPS = [
  "sun on a rock. that's the whole plan.",
  "this rock was made for a belly.",
  "do not disturb. ectothermic meeting in progress.",
  "my love language is a warm stone. this one.",
  "geology did this for me personally.",
  "I have found the center of the universe. it's flat on top.",
  "the rock is doing its job. I am doing mine. nobody move.",
  "if happiness has a temperature, it's this.",
  "I will not be taking questions. I will be taking sun.",
  "a boulder is just a chair that never learned furniture.",
  "warm stone. cool blood. that's a marriage.",
  "I parked. this is the lot. this is the only spot.",
  "the rock doesn't leave. I respect a commitment.",
  "status: loaf. location: perfect. agenda: none.",
];

export function pickPerchQuip(
  who: Critter,
  perch: "chair" | "tree" | "rock",
) {
  const list =
    perch === "chair"
      ? CHAIR_QUIPS[who]
      : perch === "tree"
        ? TREE_QUIPS[who]
        : ROCK_QUIPS;
  return pickFrom(`${who}-${perch}`, list, "sss");
}

export function tryStartDuet() {
  if (chatLock || Date.now() < duetCooldownUntil) return false;
  const duet = pickFrom("duet", DUETS, DUETS[0]!);
  if (!duet) return false;
  chatLock = true;
  emit(duet[0]);
  window.setTimeout(() => {
    emit(duet[1]);
    window.setTimeout(() => {
      chatLock = false;
      duetCooldownUntil = Date.now() + 50_000 + Math.random() * 40_000;
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
