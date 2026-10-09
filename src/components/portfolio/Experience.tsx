import { RESEARCH_ROLES, TEACHING } from '../../content/cv';
import { Logo, SectionHead } from './ui';

export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead id="exp-title" eyebrow="Experience" />
        <div className="two-col">
          <div className="glass card">
            <h3 className="label">Research</h3>
            <ol className="roles">
              {RESEARCH_ROLES.map((r) => (
                <li key={r.org} className="role">
                  <Logo id={r.logo} size="sm" />
                  <div>
                    <p className="role__title">
                      {r.title}, <span>{r.org}</span>
                    </p>
                    <p className="role__meta">
                      <span className="tnum">{r.period}</span> · {r.place}
                    </p>
                    <p className="role__detail">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass card">
            <h3 className="label">Teaching assistant</h3>
            <div className="teaching">
              {TEACHING.map((g) => (
                <div key={g.place} className="teaching__group">
                  <p className="teaching__place">
                    {g.logo ? <Logo id={g.logo} size="xs" /> : <span className="teaching__mark" aria-hidden="true" />}
                    {g.place}
                  </p>
                  <ul>
                    {g.courses.map((t) => (
                      <li key={t.course}>
                        <span className="teaching__course">
                          {t.course}
                          {t.role === 'Head TA' ? <span className="chip chip--accent">Head TA</span> : null}
                        </span>
                        {t.term ? <span className="teaching__term tnum">{t.term}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
