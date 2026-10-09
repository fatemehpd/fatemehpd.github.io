import { useEffect, useRef } from 'react';
import { toggleTheme } from '../theme';
import './Nav.css';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Projects' },
  { href: '#publications', label: 'Papers', wide: true },
  { href: '#experience', label: 'Experience', wide: true },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  // Turn into a floating glass bar once the page scrolls; written straight
  // to the DOM so scrolling never re-renders React.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const on = window.scrollY > 24;
      if (on !== el.hasAttribute('data-scrolled')) el.toggleAttribute('data-scrolled', on);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="nav" ref={ref}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" aria-label="F. Pakdaman, back to top">
          F<span>.</span>Pakdaman
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href} className={l.wide ? 'nav__wide' : undefined}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Switch between light and dark mode">
          {/* sun: shown in dark mode (switches to light) */}
          <svg className="theme-toggle__sun" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </g>
          </svg>
          {/* moon: shown in light mode (switches to dark) */}
          <svg className="theme-toggle__moon" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
