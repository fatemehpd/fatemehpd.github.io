import { useEffect, useRef } from 'react';
import { createInk } from './ink';
import './InkBackground.css';

/**
 * Pacific-blue ink blooming in water, fixed behind the page and scrubbed by
 * scroll position. React renders this once; all drawing happens on a canvas.
 */
export default function InkBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ink = createInk(canvas);
    if (!ink) {
      canvas.hidden = true;
      return;
    }
    return () => ink.destroy();
  }, []);

  return <canvas ref={ref} className="ink-bg" aria-hidden="true" />;
}
