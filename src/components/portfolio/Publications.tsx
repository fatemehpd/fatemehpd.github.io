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
        <SectionHead id="pubs-title" eyebrow="Publications" />
        <ol className="glass card pubs" aria-label={`Publications by ${PROFILE.name}`}>
          {PUBLICATIONS.map((p) => (
            <li key={p.title} className="pub">
              <span className="pub__year tnum">{p.year}</span>
              <div className="pub__body">
                <h3 className="pub__title">{p.title}</h3>
                <Authors text={p.authors} />
                <p className="pub__venue">
                  {p.venue.match(/\(([^)]+)\)/)?.[1] ?? p.venue} {p.year}
                  {p.firstAuthor ? <span className="chip chip--accent">First author</span> : null}
                  {p.url ? (
                    <ExternalLink className="text-link" href={p.url}>
                      IEEE Xplore
                    </ExternalLink>
                  ) : null}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
