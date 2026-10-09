/**
 * Scroll-scrubbed frame sequence drawn on a canvas.
 *
 * A short clip is stored as numbered WebP frames. Page scroll position picks
 * the frame; neighbouring frames are blended and eased so scrubbing stays
 * smooth. Frames load coarse-to-fine, so the whole scroll range responds
 * almost at once and fills in detail as it loads.
 */

export type ScrubConfig = {
  /** folder under public/, e.g. 'ink' → public/ink/<width>/NNN.webp */
  dir: string;
  frames: number;
  /** clip width / height */
  aspect: number;
  /** solid colour around the clip; should match the clip's own background */
  bg: string;
  /** large and small source widths available on disk */
  widths: [large: number, small: number];
  /**
   * 'pan':   tall clip shown wider than the screen and panned down with
   *          scroll (the ink).
   * 'cover': landscape clip covering the screen; on portrait screens it is
   *          fitted to width and floated on the background colour (shapes).
   */
  fit: 'pan' | 'cover';
};

export type Scrub = { destroy: () => void; redraw: () => void };

function withAlpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export function createScrub(canvas: HTMLCanvasElement, cfg: ScrubConfig): Scrub | null {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;

  const N = cfg.frames;
  const base = `${import.meta.env.BASE_URL}${cfg.dir}/`;
  const clear = withAlpha(cfg.bg, 0);
  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let srcWidth = cfg.widths[0];

  const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);
  const requested = new Set<number>();
  let queue: number[] = [];
  let inflight = 0;
  let disposed = false;

  let target = 0;
  let shown = 0;
  let pan = 0;
  let raf = 0;
  let last = 0;
  let dirty = true;

  const progress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  /* --- loading --------------------------------------------------------- */

  const buildQueue = () => {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < N && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    push(Math.round(target));
    for (const stride of [16, 8, 4, 2, 1]) for (let i = 0; i < N; i += stride) push(i);
    queue = order.filter((i) => !requested.has(i));
  };

  const pump = () => {
    while (!disposed && inflight < 4 && queue.length) {
      const i = queue.shift()!;
      if (requested.has(i)) continue;
      requested.add(i);
      inflight++;
      const img = new Image();
      img.decoding = 'async';
      img.src = `${base}${srcWidth}/${String(i).padStart(3, '0')}.webp`;
      const done = (ok: boolean) => {
        inflight--;
        if (ok && !disposed) {
          frames[i] = img;
          if (Math.abs(i - shown) < 18) {
            dirty = true;
            wake();
          }
        }
        pump();
      };
      img.decode().then(
        () => done(true),
        () => done(img.complete && img.naturalWidth > 0),
      );
    }
  };

  const nearest = (i: number) => {
    if (frames[i]) return i;
    for (let k = 1; k < N; k++) {
      if (i - k >= 0 && frames[i - k]) return i - k;
      if (i + k < N && frames[i + k]) return i + k;
    }
    return -1;
  };

  /* --- layout and drawing ---------------------------------------------------- */

  const layout = () => {
    if (cfg.fit === 'pan') {
      const w = Math.max(cssH * cfg.aspect, Math.min(cssW * 0.64, 1180));
      const h = w / cfg.aspect;
      return { w, h, x: (cssW - w) / 2, y: -Math.max(0, h - cssH) * pan };
    }
    // cover on landscape screens; width-fit (slightly enlarged) on portrait ones
    if (cssW / cssH >= 1) {
      const w = Math.max(cssW, cssH * cfg.aspect);
      const h = w / cfg.aspect;
      return { w, h, x: (cssW - w) / 2, y: (cssH - h) / 2 };
    }
    const w = cssW * 1.45;
    const h = w / cfg.aspect;
    return { w, h, x: (cssW - w) / 2, y: cssH * 0.46 - h / 2 };
  };

  const feather = (x: number, y: number, w: number, h: number) => {
    if (w < cssW + 2) {
      const fw = Math.min(w * 0.22, 220);
      const l = ctx.createLinearGradient(x, 0, x + fw, 0);
      l.addColorStop(0, cfg.bg);
      l.addColorStop(1, clear);
      ctx.fillStyle = l;
      ctx.fillRect(x - 1, 0, fw + 1, cssH);
      const r = ctx.createLinearGradient(x + w, 0, x + w - fw, 0);
      r.addColorStop(0, cfg.bg);
      r.addColorStop(1, clear);
      ctx.fillStyle = r;
      ctx.fillRect(x + w - fw, 0, fw + 1, cssH);
    }
    if (h < cssH + 2) {
      const fh = Math.min(h * 0.25, 160);
      const t = ctx.createLinearGradient(0, y, 0, y + fh);
      t.addColorStop(0, cfg.bg);
      t.addColorStop(1, clear);
      ctx.fillStyle = t;
      ctx.fillRect(0, y - 1, cssW, fh + 1);
      const b = ctx.createLinearGradient(0, y + h, 0, y + h - fh);
      b.addColorStop(0, cfg.bg);
      b.addColorStop(1, clear);
      ctx.fillStyle = b;
      ctx.fillRect(0, y + h - fh, cssW, fh + 1);
    }
  };

  const draw = () => {
    dirty = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = cfg.bg;
    ctx.fillRect(0, 0, cssW, cssH);

    const { w, h, x, y } = layout();
    const f0 = Math.floor(shown);
    const frac = shown - f0;
    const a = nearest(f0);
    if (a < 0) return;
    ctx.drawImage(frames[a]!, x, y, w, h);
    const b = f0 + 1;
    if (frac > 0.02 && b < N && frames[b] && a === f0) {
      ctx.globalAlpha = frac;
      ctx.drawImage(frames[b]!, x, y, w, h);
      ctx.globalAlpha = 1;
    }
    feather(x, y, w, h);
  };

  /* --- loop --------------------------------------------------------------- */

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    const p = progress();
    target = p * (N - 1);
    const k = reducedMq.matches ? 1 : 1 - Math.exp(-dt * 7);
    const prevShown = shown;
    const prevPan = pan;
    shown += (target - shown) * k;
    if (Math.abs(target - shown) < 0.01) shown = target;
    pan += (p - pan) * k;
    if (Math.abs(p - pan) < 0.0005) pan = p;

    if (dirty || shown !== prevShown || pan !== prevPan) draw();
    if (shown !== target || pan !== p) raf = requestAnimationFrame(frame);
  };

  const wake = () => {
    if (!raf && !disposed) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  const resize = () => {
    cssW = window.innerWidth;
    cssH = canvas.clientHeight || window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    dirty = true;
  };

  const onResize = () => {
    resize();
    wake();
  };
  const onScroll = () => {
    const t = Math.round(progress() * (N - 1));
    if (!frames[t] && !requested.has(t)) {
      queue.unshift(t);
      pump();
    }
    wake();
  };

  resize();
  // choose the source size once, before any frame is requested
  srcWidth = layout().w * dpr > cfg.widths[1] * 1.15 ? cfg.widths[0] : cfg.widths[1];
  target = shown = progress() * (N - 1);
  pan = progress();
  buildQueue();
  pump();
  draw();

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  return {
    redraw() {
      resize();
      wake();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    },
  };
}
