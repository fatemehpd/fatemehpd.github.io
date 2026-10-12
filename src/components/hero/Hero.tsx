import { useEffect, useRef } from 'react';
import { MESSAGES, type MessageId } from './frames';
import { HeroEngine, zoneFor, type Zone } from './heroEngine';
import CursorIndicator from './CursorIndicator';
import './Hero.css';

const INTERACTIVE_QUERY = '(min-width: 768px) and (hover: hover) and (pointer: fine)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const SIDE_MESSAGES: MessageId[] = ['left', 'right'];
const CENTER_MESSAGES: MessageId[] = ['hey', 'hi'];

/**
 * Interactive portfolio hero.
 *
 * The component renders once. All interaction state lives in HeroEngine,
 * which writes directly to the DOM from requestAnimationFrame, so moving the
 * cursor around never re-renders React.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const msgRefs = useRef<Partial<Record<MessageId, HTMLElement>>>({});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!root || !canvas || !button) return;

    const interactiveMq = window.matchMedia(INTERACTIVE_QUERY);
    const reducedMq = window.matchMedia(REDUCED_QUERY);

    let ready = false;
    const engine = new HeroEngine(
      { root, canvas, messages: msgRefs.current },
      {
        reducedMotion: reducedMq.matches,
        touch: !interactiveMq.matches,
        onReady: () => {
          ready = true;
          root.dataset.ready = '';
          applyMode();
        },
      },
    );

    let zone: Zone | null = null;
    let rectLeft = 0;
    let rectWidth = 1;
    let greetedOnView = false;
    let viewTimer = 0;

    const measure = () => {
      const r = root.getBoundingClientRect();
      rectLeft = r.left;
      rectWidth = Math.max(1, r.width);
    };

    const applyMode = () => {
      const desktop = interactiveMq.matches;
      root.dataset.mode = desktop ? 'pointer' : 'touch';
      engine.setInteractive(desktop && ready);
      if (!desktop) {
        zone = null;
        engine.setZone(null);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !interactiveMq.matches || !ready) return;
      const next = zoneFor((e.clientX - rectLeft) / rectWidth, zone);
      if (next !== zone) {
        zone = next;
        engine.setZone(next);
      }
    };
    const onLeave = () => {
      zone = null;
      engine.setZone(null);
    };
    const onActivate = () => {
      if (ready) engine.greet();
    };

    // Pause the animation while the hero is off-screen; on touch devices,
    // greet once when the hero is comfortably in view.
    const visibility = new IntersectionObserver(([entry]) => engine.setVisible(entry.isIntersecting), { threshold: 0 });
    visibility.observe(root);
    const onTab = () => engine.setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onTab);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (interactiveMq.matches || greetedOnView || !entry.isIntersecting) return;
        greetedOnView = true;
        viewTimer = window.setTimeout(function wait() {
          if (ready) engine.greet();
          else viewTimer = window.setTimeout(wait, 150);
        }, 650);
      },
      { threshold: 0.55 },
    );
    io.observe(root);

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    measure();

    const onReduced = () => engine.setReducedMotion(reducedMq.matches);

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerenter', measure, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });
    button.addEventListener('click', onActivate);
    interactiveMq.addEventListener('change', applyMode);
    reducedMq.addEventListener('change', onReduced);
    applyMode();

    return () => {
      engine.destroy();
      io.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onTab);
      ro.disconnect();
      window.clearTimeout(viewTimer);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerenter', measure);
      root.removeEventListener('pointerleave', onLeave);
      button.removeEventListener('click', onActivate);
      interactiveMq.removeEventListener('change', applyMode);
      reducedMq.removeEventListener('change', onReduced);
    };
  }, []);

  const setMsgRef = (id: MessageId) => (el: HTMLElement | null) => {
    if (el) msgRefs.current[id] = el;
  };

  return (
    <section className="hero" ref={rootRef} aria-labelledby="hero-name">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__side hero__side--left" />
        <div className="hero__side hero__side--right" />
      </div>

      <div className="hero__note">
        <h1 id="hero-name" className="hero__name">
          <span className="hero__im">I&rsquo;m</span> Fatemeh Pakdaman
        </h1>
        <p className="hero__role">
          AI researcher at <span>TaarLab</span>, University of Tehran
        </p>
        <p className="hero__hint">
          <CursorIndicator />
          <span className="hero__hint-pointer">Move cursor to call me !</span>
          <span className="hero__hint-touch">Tap to call me !</span>
        </p>
      </div>

      <div className="hero__stage">
        <div className="hero__glow" aria-hidden="true" />
        <button ref={buttonRef} type="button" className="hero__character" aria-label="Say hi to Fatemeh">
          <canvas
            ref={canvasRef}
            className="hero__canvas"
            role="img"
            aria-label="Animated illustration of Fatemeh working on her laptop"
          />
          <span className="hero__laptop-glow" aria-hidden="true" />
        </button>

        <div className="hero__messages" aria-hidden="true">
          {SIDE_MESSAGES.map((id) => (
            <p key={id} ref={setMsgRef(id)} className={`hero__msg hero__msg--${id}`}>
              {MESSAGES[id]}
            </p>
          ))}
          {CENTER_MESSAGES.map((id) => (
            <p key={id} ref={setMsgRef(id)} className="hero__msg hero__msg--center">
              {MESSAGES[id]}
            </p>
          ))}
          <a
            ref={setMsgRef('portfolio')}
            className="hero__msg hero__msg--center hero__msg--link"
            href="#about"
            tabIndex={-1}
          >
            {MESSAGES.portfolio}
            <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
              <path d="M6 1.5v8.5M2.5 6.75 6 10.25l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
