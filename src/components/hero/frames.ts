/**
 * Character animation, taken from the video clip of Fatemeh at her desk.
 *
 * The clip is stored as 240 transparent WebP frames (24 fps, 10 s) in
 * public/character/<648|432>/NNN.webp. Timeline of the source clip:
 *
 *     0 –  48   working (idle loop; she blinks, the laptop logo shifts colour)
 *    50 –  80   turns and looks to the left
 *    90 – 108   looks to the right
 *   114 – 140   looks up at the visitor
 *   144 – 176   takes the headset off and rests it around her neck
 *   180 – 216   waves hello
 *   218 – 239   reaches toward the laptop, smiling
 */

export const FRAME_COUNT = 240;
export const FPS = 24;
export const FRAME_ASPECT = 1; // frames are square crops

export function frameUrl(i: number, width: 648 | 432) {
  return `${import.meta.env.BASE_URL}character/${width}/${String(i).padStart(3, '0')}.webp`;
}

/** Contextual messages shown next to the character. */
export const MESSAGES = {
  left: 'Anyone here on the left?',
  right: 'Anyone here on the right?',
  hey: "Hey, it's you!",
  hi: 'Hiiii!',
  portfolio: 'Check out the portfolio',
} as const;

export type MessageId = keyof typeof MESSAGES;

/** Frame ranges used by the player. */
export const IDLE: [number, number] = [0, 48];

/**
 * One step of a reaction:
 *  - play:  run through frames a → b at `fps` (reverse if b < a)
 *  - jump:  cross-fade from whatever is showing to frame `to` over `ms`
 *  - hold:  gently rock between frames a ↔ b for `ms` (keeps her alive)
 *  - msg:   show a message (or hide with null)
 */
export type Step =
  | { kind: 'play'; a: number; b: number; fps?: number }
  | { kind: 'jump'; to: number; ms: number }
  | { kind: 'hold'; a: number; b: number; ms: number; fps?: number }
  | { kind: 'msg'; id: MessageId | null };

export type SequenceId = 'left' | 'right' | 'greet';

export const SEQUENCES: Record<SequenceId, Step[]> = {
  left: [
    { kind: 'msg', id: 'left' },
    { kind: 'jump', to: 50, ms: 160 },
    { kind: 'play', a: 50, b: 72 },
    { kind: 'hold', a: 64, b: 76, ms: 2300, fps: 10 },
    { kind: 'msg', id: null },
    { kind: 'play', a: 72, b: 50 },
    { kind: 'jump', to: 48, ms: 160 },
  ],
  right: [
    { kind: 'msg', id: 'right' },
    { kind: 'jump', to: 114, ms: 180 },
    { kind: 'play', a: 114, b: 96 },
    { kind: 'hold', a: 96, b: 104, ms: 2300, fps: 10 },
    { kind: 'msg', id: null },
    { kind: 'play', a: 104, b: 114 },
    { kind: 'jump', to: 48, ms: 220 },
  ],
  greet: [
    // looks up at the visitor
    { kind: 'msg', id: 'hey' },
    { kind: 'jump', to: 114, ms: 180 },
    { kind: 'play', a: 114, b: 178 }, // ...and takes the whole headset off
    // waves hello
    { kind: 'msg', id: 'hi' },
    { kind: 'play', a: 178, b: 216 },
    // reaches toward the laptop: "check out the portfolio"
    { kind: 'msg', id: 'portfolio' },
    { kind: 'play', a: 216, b: 239 },
    { kind: 'hold', a: 228, b: 239, ms: 2600, fps: 10 },
    { kind: 'msg', id: null },
    // puts the headset back on and returns to work
    { kind: 'jump', to: 176, ms: 450 },
    { kind: 'play', a: 176, b: 140 },
    { kind: 'jump', to: 48, ms: 260 },
  ],
};

/** Frames worth loading for each mode (touch screens only ever greet). */
export const RANGES = {
  idle: [0, 48] as [number, number],
  greet: [114, 239] as [number, number],
  left: [48, 80] as [number, number],
  right: [94, 114] as [number, number],
};

/** Frame shown for each reaction when the visitor prefers reduced motion. */
export const STILL: Record<SequenceId, { frame: number; msg: MessageId }[]> = {
  left: [{ frame: 70, msg: 'left' }],
  right: [{ frame: 100, msg: 'right' }],
  greet: [
    { frame: 196, msg: 'hi' },
    { frame: 232, msg: 'portfolio' },
  ],
};
