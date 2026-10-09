import { EDUCATION } from '../../content/cv';
import { ExternalLink, Logo, SectionHead } from './ui';

export default function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="container">
        <SectionHead id="education-title" eyebrow="Education" title="Where I studied" />
        <div className="edu-grid">
          {EDUCATION.map((e) => (
            <article key={e.school} className="glass edu-card">
              <div className="edu-card__top">
                <Logo id={e.logo} size="lg" />
                <p className="edu-card__when">
                  <span className="tnum">{e.period}</span>
                  <span className="muted">{e.place}</span>
                </p>
              </div>
              <h3 className="edu-card__school">{e.school}</h3>
              <p className="edu-card__degree">{e.degree}</p>
              <dl className="meta-list">
                <div>
                  <dt>GPA</dt>
                  <dd>{e.gpa}</dd>
                </div>
                <div>
                  <dt>{e.thesisLabel}</dt>
                  <dd className="edu-card__thesis">{e.thesis}</dd>
                </div>
                <div>
                  <dt>{e.supervisors.length > 1 ? 'Supervisors' : 'Supervisor'}</dt>
                  <dd className="link-list">
                    {e.supervisors.map((s) =>
                      s.url ? (
                        <ExternalLink key={s.name} className="text-link" href={s.url}>
                          {s.name}
                        </ExternalLink>
                      ) : (
                        <span key={s.name}>{s.name}</span>
                      ),
                    )}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
