import {
  POSES,
  RETURN_FADE,
  SEQUENCES,
  type MessageId,
  type Pose,
  type SequenceId,
  type Step,
} from './frames';

export type Zone = 'left' | 'center' | 'right';

type Layer = { el: HTMLElement; o: number };

export type HeroEngineElements = {
  root: HTMLElement;
  lifter: HTMLElement;
  layers: Record<Pose, HTMLElement>;
  messages: Partial<Record<MessageId, HTMLElement>>;
};

const EPS = 0.002;

/**
 * Imperative animation engine for the hero character.
 *
 * React renders the markup once; everything that changes per frame
 * (layer opacity, the small "excited" lift, active message, zone) is written
 * straight to the DOM from a single requestAnimationFrame loop, so the
 * interaction never causes React re-renders. The loop only runs while
 * something is actually moving or a sequence is playing.
 */
export class HeroEngine {
  private els: HeroEngineElements;
  private layers: Record<Pose, Layer>;

  private pose: Pose = 'working';
  private fade = RETURN_FADE;
  private z = 1;

  private seqId: SequenceId | null = null;
  private steps: Step[] = [];
  private stepIndex = 0;
  private stepElapsed = 0;

  private zone: Zone | null = null;
  private queued: Zone | null = null;
  private interactive = false;

  private msg: MessageId | null = null;

  // spring for the excited lift
  private lift = 0;
  private liftV = 0;
  private liftTarget = 0;

  private raf = 0;
  private last = 0;
  private reducedMotion: boolean;

  constructor(els: HeroEngineElements, opts: { reducedMotion: boolean }) {
    this.els = els;
    this.reducedMotion = opts.reducedMotion;
    this.layers = Object.fromEntries(
      POSES.map((p) => [p, { el: els.layers[p], o: p === 'working' ? 1 : 0 }]),
    ) as Record<Pose, Layer>;
    for (const p of POSES) {
      const l = this.layers[p];
      l.el.style.opacity = String(l.o);
      l.el.style.zIndex = p === 'working' ? '1' : '0';
    }
    els.root.dataset.zone = 'none';
    els.root.dataset.pose = 'working';
  }

  /* ------------------------------------------------------------ public API */

  setInteractive(on: boolean) {
    this.interactive = on;
    if (!on) this.queued = null;
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on;
  }

  /** The cursor only selects a zone; the character never tracks it. */
  setZone(zone: Zone | null) {
    if (zone === this.zone) return;
    this.zone = zone;
    this.els.root.dataset.zone = zone ?? 'none';
    if (!this.interactive) return;

    if (zone === null) {
      this.queued = null;
      return;
    }
    // The greeting is the main moment: let it finish, then react to
    // wherever the visitor is if they moved to a side meanwhile.
    if (this.seqId === 'greet') {
      this.queued = zone === 'center' ? null : zone;
      return;
    }
    this.start(zone === 'center' ? 'greet' : zone);
  }

  /** Play the greeting regardless of zone (tap, click, keyboard, mobile). */
  greet() {
    if (this.seqId === 'greet' && this.stepIndex < this.steps.length - 1) return;
    this.queued = null;
    this.start('greet');
  }

  isGreeting() {
    return this.seqId === 'greet';
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /* -------------------------------------------------------------- internals */

  private start(id: SequenceId) {
    this.seqId = id;
    this.steps = SEQUENCES[id];
    this.stepIndex = 0;
    this.els.root.dataset.seq = id;
    this.applyStep(this.steps[0]);
    this.wake();
  }

  private applyStep(step: Step) {
    this.stepElapsed = 0;
    this.setPose(step.pose, step.fade ?? 120);
    this.setMessage(step.msg);
    this.liftTarget = step.lift ?? 0;
  }

  private endSequence() {
    this.seqId = null;
    this.steps = [];
    delete this.els.root.dataset.seq;
    this.setPose('working', RETURN_FADE);
    this.setMessage(null);
    this.liftTarget = 0;

    const q = this.queued;
    this.queued = null;
    if (q && q === this.zone && this.interactive) {
      this.start(q === 'center' ? 'greet' : q);
    }
  }

  private setPose(pose: Pose, fade: number) {
    if (pose === this.pose) return;
    this.pose = pose;
    this.fade = this.reducedMotion ? 40 : fade;
    this.z += 1;
    this.layers[pose].el.style.zIndex = String(this.z);
    this.els.root.dataset.pose = pose;
  }

  private setMessage(id: MessageId | null) {
    if (id === this.msg) return;
    if (this.msg) this.els.messages[this.msg]?.removeAttribute('data-active');
    this.msg = id;
    if (id) this.els.messages[id]?.setAttribute('data-active', '');
  }

  private wake() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    // clamp dt so a backgrounded tab doesn't jump a whole sequence at once
    const dt = Math.min(64, Math.max(0, now - this.last));
    this.last = now;

    /* sequence clock */
    if (this.seqId) {
      this.stepElapsed += dt;
      const step = this.steps[this.stepIndex];
      if (this.stepElapsed >= step.hold) {
        this.stepIndex += 1;
        if (this.stepIndex < this.steps.length) this.applyStep(this.steps[this.stepIndex]);
        else this.endSequence();
      }
    }

    /* crossfade: incoming pose fades in on top, the rest fade out under it */
    let settled = true;
    const top = this.layers[this.pose];
    const kIn = 1 - Math.exp(-dt / this.fade);
    const kOut = 1 - Math.exp(-dt / (this.fade * 1.15));
    if (top.o < 1) {
      top.o += (1 - top.o) * kIn;
      if (1 - top.o < EPS) top.o = 1;
      top.el.style.opacity = top.o.toFixed(3);
      settled = settled && top.o === 1;
    }
    // start dissolving the old pose once the new one mostly covers it,
    // which avoids a see-through dip in the middle of the blend
    if (top.o > 0.45) {
      for (const p of POSES) {
        if (p === this.pose) continue;
        const l = this.layers[p];
        if (l.o === 0) continue;
        l.o -= l.o * kOut;
        if (l.o < EPS) l.o = 0;
        l.el.style.opacity = l.o.toFixed(3);
        settled = settled && l.o === 0;
      }
    } else {
      settled = false;
    }

    /* excited lift: a lightly damped spring */
    if (this.reducedMotion) {
      if (this.lift !== 0) {
        this.lift = 0;
        this.liftV = 0;
        this.els.lifter.style.transform = '';
      }
    } else {
      const s = dt / 1000;
      const acc = 180 * (this.liftTarget - this.lift) - 15 * this.liftV;
      this.liftV += acc * s;
      this.lift += this.liftV * s;
      const still = Math.abs(this.liftTarget - this.lift) < 0.001 && Math.abs(this.liftV) < 0.001;
      if (still) {
        this.lift = this.liftTarget;
        this.liftV = 0;
      }
      const y = (-this.lift * 1.1).toFixed(3);
      const sc = (1 + this.lift * 0.012).toFixed(4);
      this.els.lifter.style.transform =
        this.lift === 0 ? '' : `translate3d(0, ${y}%, 0) scale(${sc})`;
      settled = settled && still;
    }

    if (this.seqId || !settled) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.raf = 0;
    }
  };
}

/** Map a horizontal position (0..1) to a zone, with hysteresis at the edges. */
export function zoneFor(ratio: number, current: Zone | null): Zone {
  const L = 0.36;
  const R = 0.64;
  const h = 0.025;
  if (current === 'left' && ratio < L + h) return 'left';
  if (current === 'right' && ratio > R - h) return 'right';
  if (current === 'center' && ratio > L - h && ratio < R + h) return 'center';
  if (ratio < L) return 'left';
  if (ratio > R) return 'right';
  return 'center';
}
