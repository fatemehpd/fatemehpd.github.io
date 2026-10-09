/**
 * Scroll-scrubbed ink animation.
 *
 * The clip of Pacific-blue ink blooming in water is stored as a sequence of
 * WebP frames (public/ink/<width>/NNN.webp). Page scroll position picks the
 * frame, with neighbouring frames blended and a little inertia, so the ink
 * falls and blooms as the visitor scrolls. On wide screens the tall clip is
 * shown wider than the viewport and panned downward as you scroll, following
 * the ink as it sinks.
 */

export const INK_FRAMES = 147;
export const INK_BG = '#f0f4f7'; // water colour of the graded clip
const ASPECT = 720 / 1280; // width / height of the clip

export type Ink = { destroy: () => void };

export function createInk(canvas: HTMLCanvasElement): Ink | null {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;

  const base = `${import.meta.env.BASE_URL}ink/`;
  const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let srcWidth: 432 | 720 = 720;

  // frame cache
  const frames: (HTMLImageElement | null)[] = new Array(INK_FRAMES).fill(null);
  const requested = new Set<number>();
  let queue: number[] = [];
  let inflight = 0;
  let disposed = false;

  let target = 0; // frame index the scroll asks for
  let shown = 0; // frame index currently drawn (eased)
  let pan = 0; // 0..1 vertical pan
  let raf = 0;
  let last = 0;
  let dirty = true;

  const progress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  /* --- loading: coarse-to-fine so the whole scroll range works early --- */
  const buildQueue = () => {
    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < INK_FRAMES && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    const near = Math.round(target);
    push(near);
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < INK_FRAMES; i += stride) push(i);
    }
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

  /** nearest loaded frame at or around index i, searching outward */
  const nearest = (i: number) => {
    if (frames[i]) return i;
    for (let k = 1; k < INK_FRAMES; k++) {
      if (i - k >= 0 && frames[i - k]) return i - k;
      if (i + k < INK_FRAMES && frames[i + k]) return i + k;
    }
    return -1;
  };

  /* --- drawing --- */
  const layout = () => {
    // wide enough to feel like a backdrop, never narrower than the screen height allows
    const w = Math.max(cssH * ASPECT, Math.min(cssW * 0.64, 1180));
    const h = w / ASPECT;
    return { w, h, x: (cssW - w) / 2, overflowY: Math.max(0, h - cssH) };
  };

  const draw = () => {
    dirty = false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = INK_BG;
    ctx.fillRect(0, 0, cssW, cssH);

    const { w, h, x, overflowY } = layout();
    const y = -overflowY * pan;

    const f0 = Math.floor(shown);
    const frac = shown - f0;
    const a = nearest(f0);
    if (a < 0) return;
    ctx.globalAlpha = 1;
    ctx.drawImage(frames[a]!, x, y, w, h);
    const b = f0 + 1;
    if (frac > 0.02 && b < INK_FRAMES && frames[b] && a === f0) {
      ctx.globalAlpha = frac;
      ctx.drawImage(frames[b]!, x, y, w, h);
      ctx.globalAlpha = 1;
    }

    // feather the clip's left and right edges into the water colour
    if (w < cssW + 2) {
      const fw = Math.min(w * 0.22, 220);
      const left = ctx.createLinearGradient(x, 0, x + fw, 0);
      left.addColorStop(0, INK_BG);
      left.addColorStop(1, 'rgba(240, 244, 247, 0)');
      ctx.fillStyle = left;
      ctx.fillRect(x - 1, 0, fw + 1, cssH);
      const right = ctx.createLinearGradient(x + w, 0, x + w - fw, 0);
      right.addColorStop(0, INK_BG);
      right.addColorStop(1, 'rgba(240, 244, 247, 0)');
      ctx.fillStyle = right;
      ctx.fillRect(x + w - fw, 0, fw + 1, cssH);
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;

    const p = progress();
    target = p * (INK_FRAMES - 1);
    const k = reducedMq.matches ? 1 : 1 - Math.exp(-dt * 7);
    const prevShown = shown;
    shown += (target - shown) * k;
    if (Math.abs(target - shown) < 0.01) shown = target;
    const prevPan = pan;
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
    const wanted = layout().w * dpr > 560 ? 720 : 432;
    if (wanted !== srcWidth && requested.size === 0) srcWidth = wanted;
    dirty = true;
  };

  const onResize = () => {
    resize();
    wake();
  };
  const onScroll = () => {
    const t = Math.round(progress() * (INK_FRAMES - 1));
    // pull frames near a fast jump to the front of the queue
    if (!frames[t] && !requested.has(t)) {
      queue.unshift(t);
      pump();
    }
    wake();
  };

  resize();
  // pick the source size once, before any frame is requested
  srcWidth = layout().w * dpr > 560 ? 720 : 432;
  target = shown = progress() * (INK_FRAMES - 1);
  pan = progress();
  buildQueue();
  pump();
  draw();
  canvas.dataset.ready = '';

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  return {
    destroy() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    },
  };
}
