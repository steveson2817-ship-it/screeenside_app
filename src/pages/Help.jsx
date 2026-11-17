import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../components/ContentContext.jsx'
import { extras } from '../content/index.js'

export default function Help() {
  const { content } = useContent()
  const site = content.site
  const items = content.help || []
  const { helpSteps, emergencyNote } = extras

  return (
    <div className="page">
      <PageHeader eyebrow="Help Centre" title="Where to get real help" lead={site.helpIntro} icon="lifebuoy" />

      <section className="container section-tight">
        <div className="help-grid">
          {items.map((item, index) => (
            <article
              key={item.id}
              className={`help-card reveal${item.urgent ? ' urgent' : ''}`}
              style={{ '--delay': `${index * 60}ms` }}
            >
              <span className="help-icon">
                <Icon name={item.icon} size={24} />
              </span>
              <h2>{item.title}</h2>
              <p className="help-value">{item.value}</p>
              <p className="help-description">{item.description}</p>

              {item.actionType === 'phone' && item.href ? (
                <a className="btn btn-primary btn-block" href={item.href}>
                  <Icon name="phone-call" size={17} />
                  {item.actionLabel || `Call ${item.value}`}
                </a>
              ) : null}

              {item.actionType === 'link' && item.href ? (
                <a
                  className="btn btn-secondary btn-block"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon name={item.id === 'tn-cyber-crime' ? 'instagram' : 'globe'} size={17} />
                  {item.actionLabel}
                </a>
              ) : null}

              {item.actionType === 'none' ? (
                <p className="help-no-action">
                  <Icon name="users" size={15} /> No number needed — just talk to them.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="container section-tight">
        <div className="help-lower">
          <div className="steps-card">
            <h2>If it is happening to you</h2>
            <ol className="numbered-steps">
              {helpSteps.map((step) => (
                <li key={step}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="steps-note">
              You do not need to prove anything before asking for help. Telling someone is allowed even if you are
              unsure.
            </p>
          </div>

          <div className="help-side">
            <div className="emergency-card">
              <Icon name="siren" size={24} />
              <h2>Immediate danger</h2>
              <p>{emergencyNote}</p>
              <a className="btn btn-on-dark btn-block" href="tel:112">
                <Icon name="phone-call" size={17} /> Call 112
              </a>
            </div>

            <div className="note-card">
              <h2>
                <Icon name="lock" size={17} /> About anonymous reporting
              </h2>
              <p>{site.helpNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <div className="inline-cta">
          <div>
            <h2>Not ready to talk to someone yet?</h2>
            <p className="muted">The ScreenSide guide can help you work out what to say and who to tell.</p>
          </div>
          <Link className="btn btn-primary" to="/chat">
            <Icon name="chat" size={18} />
            Ask the guide
          </Link>
        </div>
      </section>
    </div>
  )
}
