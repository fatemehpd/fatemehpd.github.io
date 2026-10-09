/**
 * Character frames extracted from the original animation.
 * All frames are aligned to the same desk/laptop position, upscaled,
 * and exported with a transparent background (see public/hero/).
 */
export const POSES = [
  'working',
  'lookLeft',
  'lookRight',
  'surprised',
  'headsetOff',
  'wave',
  'pointDown',
] as const;

export type Pose = (typeof POSES)[number];

const FILE: Record<Pose, string> = {
  working: 'working',
  lookLeft: 'look-left',
  lookRight: 'look-right',
  surprised: 'surprised',
  headsetOff: 'headset-off',
  wave: 'wave',
  pointDown: 'point-down',
};

export const FRAME_ASPECT = 1656 / 1864; // width / height of the source frames

export function frameSrc(pose: Pose, width: 720 | 1200) {
  return `${import.meta.env.BASE_URL}hero/${FILE[pose]}-${width}.webp`;
}

export function frameSrcSet(pose: Pose) {
  return `${frameSrc(pose, 720)} 720w, ${frameSrc(pose, 1200)} 1200w`;
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

export type Step = {
  pose: Pose;
  /** how long to stay on this step, in ms */
  hold: number;
  msg: MessageId | null;
  /** crossfade time constant used when entering this pose (ms) */
  fade?: number;
  /** small upward "excited" lift, 0..1 */
  lift?: number;
};

export type SequenceId = 'left' | 'right' | 'greet';

export const SEQUENCES: Record<SequenceId, Step[]> = {
  left: [{ pose: 'lookLeft', hold: 2600, msg: 'left', fade: 110 }],
  right: [{ pose: 'lookRight', hold: 2600, msg: 'right', fade: 110 }],
  greet: [
    // looks up at the visitor, a little startled and excited
    { pose: 'surprised', hold: 1050, msg: 'hey', fade: 85, lift: 1 },
    // takes the whole headset off and rests it around her neck
    { pose: 'headsetOff', hold: 1100, msg: 'hey', fade: 100, lift: 0.2 },
    // waves hello
    { pose: 'wave', hold: 1800, msg: 'hi', fade: 95, lift: 0.55 },
    // points down toward the portfolio
    { pose: 'pointDown', hold: 3000, msg: 'portfolio', fade: 100, lift: 0 },
  ],
};

/** fade constant used when settling back into the working pose */
export const RETURN_FADE = 150;
