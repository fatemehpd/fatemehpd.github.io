import { useRef, useState, type ReactNode } from 'react';
import { LOGOS, PROFILE, type LogoId } from '../../content/cv';

export function SectionHead({ eyebrow, title, intro, id }: { eyebrow: string; title?: ReactNode; intro?: ReactNode; id: string }) {
  return (
    <header className="sec-head">
      {title ? (
        <>
          <p className="sec-head__eyebrow">{eyebrow}</p>
          <h2 className="sec-head__title" id={id}>
            {title}
          </h2>
        </>
      ) : (
        <h2 className="sec-head__eyebrow" id={id}>
          {eyebrow}
        </h2>
      )}
      {intro ? <p className="sec-head__intro">{intro}</p> : null}
    </header>
  );
}

export function Logo({ id, size = 'md' }: { id: LogoId; size?: 'sm' | 'md' | 'lg' }) {
  const l = LOGOS[id];
  return (
    <span className={`logo-tile logo-tile--${size} logo-tile--${id}`}>
      <img src={l.src} alt={l.alt} width={l.w} height={l.h} loading="lazy" decoding="async" />
    </span>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer noopener">
      {children}
      <svg className="ext-icon" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="M4 2.5h5.5V8M9.3 2.7 2.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/** Shows the address as selectable text with a copy button. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLAnchorElement>(null);
  const timer = useRef(0);

  const selectText = () => {
    const el = textRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    };
    try {
      navigator.clipboard.writeText(email).then(done, selectText);
    } catch {
      selectText();
    }
  };

  return (
    <span className="copy-email">
      <a ref={textRef} className="copy-email__text" href={`mailto:${email}`}>
        {email}
      </a>
      <button type="button" className="copy-email__btn" onClick={copy} aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </span>
  );
}

/** Both email addresses (each with a copy button) and LinkedIn. */
export function ContactLinks() {
  return (
    <div className="contact-links">
      {PROFILE.emails.map((e) => (
        <CopyEmail key={e} email={e} />
      ))}
      <ExternalLink className="btn-glass" href={PROFILE.linkedin}>
        LinkedIn
      </ExternalLink>
    </div>
  );
}
