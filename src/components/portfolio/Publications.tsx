import { PROFILE, PUBLICATIONS } from '../../content/cv';
import { ExternalLink, SectionHead } from './ui';

/** Bold her own name inside the author list. */
function Authors({ text }: { text: string }) {
  const me = 'F. Pakdaman';
  const parts = text.split(me);
  return (
    <p className="pub__authors">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 ? <strong>{me}</strong> : null}
        </span>
      ))}
    </p>
  );
}

export default function Publications() {
  return (
    <section className="section" id="publications" aria-labelledby="pubs-title">
      <div className="container">
        <SectionHead id="pubs-title" eyebrow="Publications" title="Papers" />
        <ol className="pubs" aria-label={`Publications by ${PROFILE.name}`}>
          {PUBLICATIONS.map((p) => (
            <li key={p.title} className="glass pub">
              <span className="pub__year tnum">{p.year}</span>
              <div className="pub__body">
                <div className="pub__tags">
                  <span className="chip chip--strong">{p.venue.match(/\(([^)]+)\)/)?.[1] ?? 'Conference'}</span>
                  {p.firstAuthor ? <span className="chip chip--accent">First author</span> : null}
                </div>
                <h3 className="pub__title">{p.title}</h3>
                <Authors text={p.authors} />
                <p className="pub__venue">
                  {p.venue}, {p.year}
                </p>
                {p.url ? (
                  <ExternalLink className="text-link" href={p.url}>
                    Read on IEEE Xplore
                  </ExternalLink>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
