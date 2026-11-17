import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { extras } from '../content/index.js'

export default function Privacy() {
  const { privacyPoints } = extras

  return (
    <div className="page">
      <PageHeader
        eyebrow="Privacy & safety"
        title="What ScreenSide does with your information"
        lead="ScreenSide is built for students, so it collects as little as possible and never asks you to sign in or share personal details."
        icon="lock"
      />

      <section className="container section-tight">
        <div className="privacy-grid">
          {privacyPoints.map((point, index) => (
            <article key={point.title} className="privacy-card reveal" style={{ '--delay': `${index * 60}ms` }}>
              <span className="privacy-icon">
                <Icon name={point.icon} size={22} />
              </span>
              <h2>{point.title}</h2>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-tight">
        <div className="privacy-note">
          <h2>
            <Icon name="shield" size={20} /> A fresh chat every time
          </h2>
          <p>
            When you close the site or reload the page, your chat starts completely empty. ScreenSide does not
            restore your previous conversation, and it does not keep a copy of it in a database. Your lessons and
            safety checklist live only in your own browser.
          </p>
          <p>
            ScreenSide cannot see who you are, cannot contact anyone for you, and is not monitored by teachers. If
            you need help beyond general guidance, tell a trusted adult — that is always the right next step.
          </p>
          <div className="privacy-actions">
            <Link to="/help" className="btn btn-primary">
              <Icon name="lifebuoy" size={17} /> Open the Help Centre
            </Link>
            <Link to="/chat" className="btn btn-secondary">
              <Icon name="chat" size={17} /> Ask the guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
