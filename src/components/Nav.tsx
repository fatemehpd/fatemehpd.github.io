import { useEffect, useRef } from 'react';
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
      </div>
    </header>
  );
}
