import { PROFILE, SKILLS } from '../../content/cv';
import { SectionHead } from './ui';

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead id="skills-title" eyebrow="Skills" />
        <div className="glass card skills">
          {SKILLS.map((g) => (
            <div key={g.group} className="skill-row">
              <p className="skill-row__name">{g.group}</p>
              <ul className="chips">
                {g.items.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="skill-row">
            <p className="skill-row__name">Languages</p>
            <ul className="chips">
              {PROFILE.languages.map((l) => (
                <li key={l.name} className="chip">
                  {l.name} <span className="muted">· {l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
