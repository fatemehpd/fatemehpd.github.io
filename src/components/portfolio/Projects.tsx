import { useMemo, useState } from 'react';
import { PROJECTS, type ProjectCategory } from '../../content/cv';
import { SectionHead } from './ui';

type Filter = 'All' | ProjectCategory;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Robotics', label: 'Robotics' },
  { id: 'Deep Learning', label: 'Deep learning' },
  { id: 'Course', label: 'Course projects' },
];

const SORTED = [...PROJECTS].sort((a, b) => b.sort.localeCompare(a.sort));

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: PROJECTS.length };
    for (const p of PROJECTS) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);
  const shown = filter === 'All' ? SORTED : SORTED.filter((p) => p.category === filter);

  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="sec-head-row">
          <SectionHead
            id="work-title"
            eyebrow="Projects"
            title="Selected work"
            intro="Drones and rovers in the field, robots in simulation, and deep learning for medical images and street scenes."
          />
          <div className="glass glass--pill segmented" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="segmented__btn"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="segmented__count tnum">{counts[f.id] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <ul className="project-grid" aria-live="polite">
          {shown.map((p) => (
            <li key={p.title} className={`glass project${p.featured ? ' project--featured' : ''}`}>
              <div className="project__meta">
                <span className={`cat cat--${p.category.replace(' ', '-').toLowerCase()}`}>{p.category === 'Course' ? 'Course project' : p.category}</span>
                <span className="project__date tnum">{p.date}</span>
              </div>
              <h3 className="project__title">{p.title}</h3>
              {p.context ? <p className="project__context">{p.context}</p> : null}
              <p className="project__summary">{p.summary}</p>
              {p.role ? (
                <p className="project__role">
                  <span>My part</span> {p.role}
                </p>
              ) : null}
              {p.metric ? (
                <p className="project__metric">
                  <span className="project__metric-value tnum">{p.metric.value}</span>
                  <span className="project__metric-label">{p.metric.label}</span>
                </p>
              ) : null}
              <ul className="chips project__tags" aria-label="Tools and topics">
                {p.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
