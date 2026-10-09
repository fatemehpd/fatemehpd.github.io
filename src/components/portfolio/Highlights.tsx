import { CERTIFICATES, HONORS, PROFILE, SKILLS } from '../../content/cv';
import { ExternalLink, SectionHead } from './ui';

export default function Highlights() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead id="skills-title" eyebrow="Skills and recognition" title="Toolbox, awards and certificates" />
        <div className="bento">
          <article className="glass bento__honors">
            <div>
              <h3 className="label">Honors and awards</h3>
              <ul className="honors">
                {HONORS.map((h) => (
                  <li key={h.title} className="honor">
                    <span className="honor__mark" aria-hidden="true">
                      {h.mark}
                    </span>
                    <div>
                      <p className="honor__title">{h.title}</p>
                      <p className="honor__detail">{h.detail}</p>
                      {h.url ? (
                        <ExternalLink className="text-link" href={h.url}>
                          View ranking
                        </ExternalLink>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="label">Languages</h3>
              <ul className="langs">
                {PROFILE.languages.map((l) => (
                  <li key={l.name}>
                    <span>{l.name}</span>
                    <span className="muted">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="glass bento__skills">
            <h3 className="label">Skills</h3>
            <div className="skill-groups">
              {SKILLS.map((g) => (
                <div key={g.group} className="skill-group">
                  <p className="skill-group__name">{g.group}</p>
                  <ul className="chips">
                    {g.items.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>

          <article className="glass bento__certs">
            <h3 className="label">Certificates</h3>
            <ul className="certs">
              {CERTIFICATES.map((c) => (
                <li key={c.title} className="cert">
                  <ExternalLink className="cert__link" href={c.url}>
                    {c.title}
                  </ExternalLink>
                  <p className="cert__meta tnum">{c.meta}</p>
                </li>
              ))}
            </ul>
          </article>

        </div>
      </div>
    </section>
  );
}
