import { useEffect, useRef } from 'react';
import { currentTheme, onThemeChange, type Theme } from '../../theme';
import { createScrub, type Scrub, type ScrubConfig } from './scrub';
import './Background.css';

/** Light mode: Pacific-blue ink blooming in water (tall clip, panned). */
const INK: ScrubConfig = { dir: 'ink', frames: 147, aspect: 720 / 1280, bg: '#f0f4f7', widths: [720, 432], fit: 'pan' };
/** Dark mode: particle shapes morphing (wave → sphere → torus → ribbon → wave). */
const SHAPES: ScrubConfig = { dir: 'shapes', frames: 160, aspect: 1280 / 720, bg: '#0a0b12', widths: [1280, 720], fit: 'cover' };

const CONFIG: Record<Theme, ScrubConfig> = { light: INK, dark: SHAPES };
const FADE_MS = 650;

/**
 * Fixed, scroll-scrubbed background behind the whole page. Each theme has its
 * own canvas; switching themes cross-fades between them and the hidden one is
 * released after the fade. React renders this once.
 */
export default function Background() {
  const refs = useRef<Record<Theme, HTMLCanvasElement | null>>({ light: null, dark: null });

  useEffect(() => {
    const engines: Partial<Record<Theme, Scrub>> = {};
    const timers: Partial<Record<Theme, number>> = {};

    const show = (theme: Theme) => {
      const other: Theme = theme === 'dark' ? 'light' : 'dark';
      const canvas = refs.current[theme];
      if (!canvas) return;
      window.clearTimeout(timers[theme]);
      if (!engines[theme]) {
        const e = createScrub(canvas, CONFIG[theme]);
        if (e) engines[theme] = e;
        else canvas.hidden = true; // body colour takes over
      }
      canvas.dataset.active = '';
      const otherCanvas = refs.current[other];
      if (otherCanvas) delete otherCanvas.dataset.active;
      timers[other] = window.setTimeout(() => {
        engines[other]?.destroy();
        delete engines[other];
      }, FADE_MS + 100);
    };

    show(currentTheme());
    const stop = onThemeChange(show);
    return () => {
      stop();
      Object.values(timers).forEach((t) => window.clearTimeout(t));
      Object.values(engines).forEach((e) => e?.destroy());
    };
  }, []);

  return (
    <div className="page-bg" aria-hidden="true">
      <canvas ref={(el) => void (refs.current.light = el)} className="page-bg__canvas" />
      <canvas ref={(el) => void (refs.current.dark = el)} className="page-bg__canvas" />
    </div>
  );
}
