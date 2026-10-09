import { RESEARCH_ROLES, TEACHING, VOLUNTEERING } from '../../content/cv';
import { Logo, SectionHead } from './ui';

export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead id="exp-title" eyebrow="Experience" title="Research, leadership and teaching" />
        <div className="exp-grid">
          <div className="glass exp-panel">
            <h3 className="label">Research and leadership</h3>
            <ol className="timeline">
              {RESEARCH_ROLES.map((r) => (
                <li key={r.org} className="timeline__item">
                  {r.logo ? <Logo id={r.logo} size="sm" /> : <span className="logo-tile logo-tile--sm" />}
                  <div className="timeline__body">
                    <p className="timeline__period tnum">{r.period}</p>
                    <h4 className="timeline__title">
                      {r.title}, <span>{r.org}</span>
                    </h4>
                    <p className="timeline__place">{r.place}</p>
                    <p className="timeline__detail">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass exp-panel">
            <h3 className="label">Teaching assistant</h3>
            <ul className="teaching">
              {TEACHING.map((t) => (
                <li key={t.course} className="teaching__item">
                  <div className="teaching__head">
                    <h4 className="teaching__course">{t.course}</h4>
                    {t.role === 'Head TA' ? <span className="chip chip--accent">Head TA</span> : null}
                  </div>
                  <p className="teaching__meta">
                    <span className="tnum">{t.term}</span> · {t.with}
                  </p>
                  <p className="teaching__where">{t.where}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass exp-panel volunteer-panel">
            <h3 className="label">Volunteering</h3>
            <ul className="volunteer">
              {VOLUNTEERING.map((v) => (
                <li key={v.title}>
                  <span className="volunteer__date tnum">{v.date}</span>
                  <p className="volunteer__title">{v.title}</p>
                  <p className="volunteer__detail">{v.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
