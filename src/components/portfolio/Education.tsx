import { EDUCATION } from '../../content/cv';
import { ExternalLink, Logo, SectionHead } from './ui';

export default function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="container">
        <SectionHead id="education-title" eyebrow="Education" />
        <div className="two-col">
          {EDUCATION.map((e) => (
            <article key={e.school} className="glass card edu">
              <div className="org">
                <Logo id={e.logo} size="md" />
                <div>
                  <h3 className="org__name">{e.school}</h3>
                  <p className="org__place">
                    {e.degree} · <span className="tnum">{e.period}</span>
                  </p>
                </div>
              </div>
              <dl className="meta-list">
                <div>
                  <dt>GPA</dt>
                  <dd>{e.gpa}</dd>
                </div>
                <div>
                  <dt>Thesis</dt>
                  <dd className="edu__thesis">{e.thesis}</dd>
                </div>
                <div>
                  <dt>{e.supervisors.length > 1 ? 'Supervisors' : 'Supervisor'}</dt>
                  <dd className="link-list">
                    {e.supervisors.map((s) =>
                      s.url ? (
                        <ExternalLink key={s.name} className="text-link" href={s.url}>
                          {s.name.replace('Prof. ', '')}
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
