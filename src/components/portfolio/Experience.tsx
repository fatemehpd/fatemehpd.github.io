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
            <ul className="teaching">
              {TEACHING.map((t) => (
                <li key={t.course}>
                  <span className="teaching__course">
                    {t.course}
                    {t.role === 'Head TA' ? <span className="chip chip--accent">Head TA</span> : null}
                  </span>
                  <span className="teaching__term tnum">{t.term}</span>
                </li>
              ))}
            </ul>
            <p className="note">
              At K. N. Toosi University of Technology, except Advanced Programming (Enghelab-e Eslami Technical College).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
