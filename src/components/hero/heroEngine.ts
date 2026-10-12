import {
  FPS,
  FRAME_COUNT,
  IDLE,
  RANGES,
  SEQUENCES,
  STILL,
  frameUrl,
  type MessageId,
  type SequenceId,
  type Step,
} from './frames';

export type Zone = 'left' | 'center' | 'right';

export type HeroEngineElements = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  messages: Partial<Record<MessageId, HTMLElement>>;
};

/* ------------------------------------------------------------------------ */
/* Frame loading                                                             */
/* ------------------------------------------------------------------------ */

/**
 * Loads character frames in priority order: the idle loop first, then the
 * greeting, then the side reactions, each coarse-to-fine. The player always
 * draws the nearest loaded frame, so nothing waits on the network.
 */
class FrameStore {
  readonly frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
  private queue: number[] = [];
  private requested = new Set<number>();
  private inflight = 0;
  private disposed = false;

  private width: 648 | 432;
  private onLoad: (i: number) => void;

  constructor(width: 648 | 432, onLoad: (i: number) => void) {
    this.width = width;
    this.onLoad = onLoad;
  }

  /** Queue the frames needed for the given ranges, coarse-to-fine. */
  want(ranges: [number, number][]) {
    const order: number[] = [];
    const seen = new Set<number>();
    for (const stride of [8, 4, 2, 1]) {
      for (const [a, b] of ranges) {
        for (let i = a; i <= b; i += stride) {
          if (!seen.has(i) && !this.requested.has(i)) {
            seen.add(i);
            order.push(i);
          }
        }
      }
    }
    this.queue.push(...order);
    this.pump();
  }

  private pump() {
    while (!this.disposed && this.inflight < 6 && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.requested.has(i)) continue;
      this.requested.add(i);
      this.inflight++;
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(i, this.width);
      const done = (ok: boolean) => {
        this.inflight--;
        if (ok && !this.disposed) {
          this.frames[i] = img;
          this.onLoad(i);
        }
        this.pump();
      };
      img.decode().then(
        () => done(true),
        () => done(img.complete && img.naturalWidth > 0),
      );
    }
  }

  /** The loaded frame closest to i (or null if nothing has loaded yet). */
  get(i: number) {
    const f = this.frames;
    if (f[i]) return f[i];
    for (let k = 1; k < FRAME_COUNT; k++) {
      if (i - k >= 0 && f[i - k]) return f[i - k];
      if (i + k < FRAME_COUNT && f[i + k]) return f[i + k];
    }
    return null;
  }

  destroy() {
    this.disposed = true;
    this.queue = [];
  }
}

/* ------------------------------------------------------------------------ */
/* Player                                                                     */
/* ------------------------------------------------------------------------ */

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * Imperative character player.
 *
 * React renders the markup once; this class draws frames on a canvas from a
 * single requestAnimationFrame loop and toggles message attributes directly,
 * so interaction never re-renders React. When idle she keeps working (a short
 * ping-pong loop); each reaction is a real clip from the source video, joined
 * to the others with brief cross-fades.
 */
export class HeroEngine {
  private els: HeroEngineElements;
  private ctx: CanvasRenderingContext2D;
  private store: FrameStore;

  // what is on screen: frame `cur`, optionally fading into `next`
  private cur = 0;
  private next = -1;
  private mix = 0;

  // idle loop
  private idlePos = 0;
  private idleDir = 1;

  // running sequence
  private seqId: SequenceId | null = null;
  private steps: Step[] = [];
  private stepIndex = 0;
  private stepTime = 0; // ms spent in the current step
  private pos = 0; // fractional frame within play/hold steps
  private dir = 1;
  private jumpFrom = 0;

  private zone: Zone | null = null;
  private queued: Zone | null = null;
  private interactive = false;
  private msg: MessageId | null = null;

  private raf = 0;
  private last = 0;
  private visible = true;
  private dirty = true;
  private reducedMotion: boolean;
  private dpr = 1;
  private ro: ResizeObserver;
  private onReady?: () => void;

  constructor(
    els: HeroEngineElements,
    opts: { reducedMotion: boolean; touch: boolean; onReady?: () => void },
  ) {
    this.els = els;
    this.reducedMotion = opts.reducedMotion;
    this.onReady = opts.onReady;
    this.ctx = els.canvas.getContext('2d')!;

    const cssW = els.canvas.clientWidth || 600;
    const width: 648 | 432 = opts.touch && cssW < 520 ? 432 : 648;
    this.store = new FrameStore(width, (i) => {
      if (i === 0 && this.onReady) {
        this.onReady();
        this.onReady = undefined;
      }
      if (Math.abs(i - this.cur) < 6) {
        this.dirty = true;
        this.wake();
      }
    });
    const ranges: [number, number][] = [[0, 0], RANGES.idle, RANGES.greet];
    if (!opts.touch) ranges.push(RANGES.left, RANGES.right);
    this.store.want(ranges);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(els.canvas);
    this.resize();

    els.root.dataset.zone = 'none';
    this.wake();
  }

  /* --- public API ----------------------------------------------------- */

  setInteractive(on: boolean) {
    this.interactive = on;
    if (!on) this.queued = null;
  }

  setReducedMotion(on: boolean) {
    this.reducedMotion = on;
    this.wake();
  }

  setVisible(on: boolean) {
    this.visible = on;
    if (on) this.wake();
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
    // the greeting is the main moment: let it finish, then react to a side
    if (this.seqId === 'greet') {
      this.queued = zone === 'center' ? null : zone;
      return;
    }
    this.start(zone === 'center' ? 'greet' : zone);
  }

  /** Play the greeting regardless of zone (tap, click, keyboard, mobile). */
  greet() {
    if (this.seqId === 'greet') return;
    this.queued = null;
    this.start('greet');
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ro.disconnect();
    this.store.destroy();
  }

  /* --- sequencing ----------------------------------------------------- */

  private stillSteps(id: SequenceId): Step[] {
    const steps: Step[] = [];
    for (const s of STILL[id]) {
      steps.push({ kind: 'msg', id: s.msg }, { kind: 'jump', to: s.frame, ms: 0 }, { kind: 'hold', a: s.frame, b: s.frame, ms: 2400 });
    }
    steps.push({ kind: 'msg', id: null }, { kind: 'jump', to: 0, ms: 0 });
    return steps;
  }

  private start(id: SequenceId) {
    this.settleFade();
    this.seqId = id;
    this.steps = this.reducedMotion ? this.stillSteps(id) : SEQUENCES[id];
    this.stepIndex = -1;
    this.els.root.dataset.seq = id;
    this.advance();
    this.wake();
  }

  /** Commit a half-finished cross-fade so the next one starts cleanly. */
  private settleFade() {
    if (this.next >= 0) {
      if (this.mix >= 0.5) this.cur = this.next;
      this.next = -1;
      this.mix = 0;
      this.dirty = true;
    }
  }

  private advance() {
    this.stepIndex++;
    this.stepTime = 0;
    if (this.stepIndex >= this.steps.length) {
      this.finish();
      return;
    }
    const s = this.steps[this.stepIndex];
    if (s.kind === 'msg') {
      this.setMessage(s.id);
      this.advance();
    } else if (s.kind === 'play') {
      this.settleFade();
      this.pos = s.a;
      this.dir = s.b >= s.a ? 1 : -1;
    } else if (s.kind === 'hold') {
      this.settleFade();
      this.pos = Math.min(Math.max(this.cur, Math.min(s.a, s.b)), Math.max(s.a, s.b));
      this.dir = 1;
    } else if (s.kind === 'jump') {
      this.settleFade();
      this.jumpFrom = this.cur;
      if (s.ms <= 0 || s.to === this.cur) {
        this.cur = s.to;
        this.dirty = true;
        this.advance();
      }
    }
  }

  private finish() {
    this.seqId = null;
    this.steps = [];
    delete this.els.root.dataset.seq;
    this.setMessage(null);
    this.idlePos = Math.min(Math.max(this.cur, IDLE[0]), IDLE[1]);
    this.idleDir = this.idlePos >= IDLE[1] ? -1 : 1;

    const q = this.queued;
    this.queued = null;
    if (q && q === this.zone && this.interactive) this.start(q === 'center' ? 'greet' : q);
  }

  private setMessage(id: MessageId | null) {
    if (id === this.msg) return;
    if (this.msg) this.els.messages[this.msg]?.removeAttribute('data-active');
    this.msg = id;
    if (id) this.els.messages[id]?.setAttribute('data-active', '');
  }

  /* --- frame loop ---------------------------------------------------------- */

  private wake() {
    if (this.raf || !this.visible) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.raf = 0;
    const dt = Math.min(64, Math.max(0, now - this.last));
    this.last = now;
    const before = this.cur;
    const beforeMix = this.mix;

    if (this.seqId) {
      this.stepTime += dt;
      const s = this.steps[this.stepIndex];
      if (s?.kind === 'play') {
        const fps = s.fps ?? FPS;
        this.pos += this.dir * (dt / 1000) * fps;
        const done = this.dir > 0 ? this.pos >= s.b : this.pos <= s.b;
        this.cur = done ? s.b : Math.round(this.pos);
        if (done) this.advance();
      } else if (s?.kind === 'hold') {
        const lo = Math.min(s.a, s.b);
        const hi = Math.max(s.a, s.b);
        if (hi > lo) {
          this.pos += this.dir * (dt / 1000) * (s.fps ?? 10);
          if (this.pos >= hi) {
            this.pos = hi;
            this.dir = -1;
          } else if (this.pos <= lo) {
            this.pos = lo;
            this.dir = 1;
          }
          this.cur = Math.round(this.pos);
        }
        if (this.stepTime >= s.ms) this.advance();
      } else if (s?.kind === 'jump') {
        const t = Math.min(1, this.stepTime / s.ms);
        this.cur = this.jumpFrom;
        this.next = s.to;
        this.mix = ease(t);
        if (t >= 1) {
          this.cur = s.to;
          this.next = -1;
          this.mix = 0;
          this.advance();
        }
      }
    } else if (!this.reducedMotion) {
      // idle: keep working, ping-ponging through the loop
      this.idlePos += this.idleDir * (dt / 1000) * FPS;
      if (this.idlePos >= IDLE[1]) {
        this.idlePos = IDLE[1];
        this.idleDir = -1;
      } else if (this.idlePos <= IDLE[0]) {
        this.idlePos = IDLE[0];
        this.idleDir = 1;
      }
      this.cur = Math.round(this.idlePos);
    }

    if (this.dirty || this.cur !== before || this.mix !== beforeMix) this.draw();

    const animating = !!this.seqId || !this.reducedMotion;
    if (animating && this.visible) this.raf = requestAnimationFrame(this.tick);
  };

  private resize() {
    const c = this.els.canvas;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(c.clientWidth * this.dpr));
    const h = Math.max(1, Math.round(c.clientHeight * this.dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
      this.ctx.imageSmoothingQuality = 'high';
    }
    this.dirty = true;
    this.draw();
  }

  private draw() {
    this.dirty = false;
    const { width: w, height: h } = this.els.canvas;
    const a = this.store.get(this.cur);
    if (!a) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 1;
    ctx.drawImage(a, 0, 0, w, h);
    if (this.next >= 0 && this.mix > 0) {
      const b = this.store.get(this.next);
      if (b && b !== a) {
        // exact linear cross-fade (1-m)·A + m·B: additive blending of the
        // premultiplied frames, so she never turns see-through mid-fade
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 1 - this.mix;
        ctx.drawImage(a, 0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.mix;
        ctx.drawImage(b, 0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
  }
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
