import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../components/ContentContext.jsx'
import { extras } from '../content/index.js'
import { CHECKLIST_KEY, loadList, saveList } from '../lib/storage.js'

export default function Safety() {
  const { content } = useContent()
  const tips = content.tips || []
  const { checklist } = extras
  const [checked, setChecked] = useState(() => loadList(CHECKLIST_KEY))

  const toggle = (item) => {
    const next = checked.includes(item) ? checked.filter((value) => value !== item) : [...checked, item]
    setChecked(next)
    saveList(CHECKLIST_KEY, next)
  }

  const progress = checklist.length ? Math.round((checked.length / checklist.length) * 100) : 0

  return (
    <div className="page">
      <PageHeader
        eyebrow="Safety Tips"
        title="Small habits that keep you safer online"
        lead="Eight practical tips you can actually use — plus a checklist to fill in for your own accounts."
        icon="shield"
      />

      <section className="container section-tight">
        <div className="tip-grid">
          {tips.map((tip, index) => (
            <article key={tip.id} className="tip-card reveal" style={{ '--delay': `${index * 50}ms` }}>
              <span className="tip-icon">
                <Icon name={tip.icon} size={22} />
              </span>
              <h2>{tip.title}</h2>
              <p className="tip-summary">{tip.summary}</p>
              <ul className="tip-points">
                {tip.points.map((point) => (
                  <li key={point}>
                    <Icon name="check" size={15} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-tight">
        <div className="checklist-panel">
          <div className="checklist-head">
            <div>
              <span className="eyebrow">My safety check-up</span>
              <h2>Check off what you have already done</h2>
              <p className="muted">
                This is just for you. It is saved in your browser only, and nobody else can see it.
              </p>
            </div>
            <div className="checklist-score">
              <strong>{checked.length}</strong>
              <span>of {checklist.length} done</span>
            </div>
          </div>

          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>

          <ul className="checklist">
            {checklist.map((item) => {
              const isChecked = checked.includes(item)
              return (
                <li key={item}>
                  <button
                    type="button"
                    className={`check-item${isChecked ? ' checked' : ''}`}
                    onClick={() => toggle(item)}
                    aria-pressed={isChecked}
                  >
                    <span className="check-box">{isChecked ? <Icon name="check" size={15} /> : null}</span>
                    <span>{item}</span>
                  </button>
                </li>
              )
            })}
          </ul>

          {checked.length === checklist.length ? (
            <p className="checklist-done">
              <Icon name="trophy" size={18} /> Nice work — your accounts are in much better shape.
            </p>
          ) : null}
        </div>
      </section>

      <section className="container section-tight">
        <div className="reminder-band">
          <Icon name="shield" size={26} />
          <p>{content.site.safetyReminder}</p>
        </div>
      </section>
    </div>
  )
}
