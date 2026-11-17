import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useContent } from '../components/ContentContext.jsx'
import { extras } from '../content/index.js'

export default function Home() {
  const { content } = useContent()
  const site = content.site
  const { features } = extras
  const firstLesson = (content.lessons || [])[0]
  const scenarioCount = (content.quest || []).length

  return (
    <div className="home">
      <section className="hero container">
        <div className="hero-copy reveal">
          <span className="badge">
            <Icon name="sparkles" size={15} />
            {site.heroBadge}
          </span>
          <h1>{site.heroTitle}</h1>
          <p className="lead">{site.heroText}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/learn">
              Explore the lessons
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link className="btn btn-secondary btn-lg" to="/chat">
              <Icon name="chat" size={18} />
              Start chatting
            </Link>
          </div>
          <ul className="hero-points">
            <li>
              <Icon name="check" size={16} /> No sign-up needed
            </li>
            <li>
              <Icon name="check" size={16} /> Written for students
            </li>
            <li>
              <Icon name="check" size={16} /> Real, verified help
            </li>
          </ul>
        </div>

        <div className="hero-art reveal" aria-hidden="true">
          <div className="hero-glow" />
          <div className="phone">
            <div className="phone-top">
              <span className="phone-dot" />
              <span className="phone-title">class group chat</span>
            </div>
            <div className="phone-thread">
              <div className="bubble bubble-in">u ok? that message was mean</div>
              <div className="bubble bubble-out">not really</div>
              <div className="bubble bubble-in">you don't deserve that. want me to come with you to tell someone?</div>
            </div>
            <div className="phone-input">message…</div>
          </div>
          <div className="float-card float-a">
            <Icon name="shield" size={18} />
            <span>Block &amp; report</span>
          </div>
          <div className="float-card float-b">
            <Icon name="heart" size={18} />
            <span>You're not alone</span>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Five ways to get started</span>
            <h2>{site.featuresTitle}</h2>
            <p className="muted">{site.featuresText}</p>
          </div>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <Link
              key={feature.id}
              to={feature.to}
              className={`feature-card reveal reveal-${index + 1}`}
              style={{ '--delay': `${index * 70}ms` }}
            >
              <span className="feature-icon">
                <Icon name={feature.icon} size={24} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="feature-cta">
                {feature.cta}
                <Icon name="arrow-right" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="awareness">
        <div className="container awareness-inner">
          <span className="awareness-icon">
            <Icon name="shield" size={28} />
          </span>
          <div className="awareness-copy">
            <h2>{site.awarenessTitle}</h2>
            <p>{site.awarenessText}</p>
          </div>
          <Link to="/help" className="btn btn-on-dark">
            See where to get help
            <Icon name="arrow-right" size={17} />
          </Link>
        </div>
      </section>

      <section className="section container">
        <div className="split-panel">
          <div>
            <span className="eyebrow">Not sure where to start?</span>
            <h2>Two good first steps</h2>
            <p className="muted">
              You do not need to read everything to begin. Pick the one that fits what you need right now.
            </p>
          </div>
          <div className="split-cards">
            <Link to={firstLesson ? `/learn/${firstLesson.id}` : '/learn'} className="mini-card">
              <Icon name="book" size={22} />
              <div>
                <h3>Understand it first</h3>
                <p>Start with lesson 1, a two-minute read.</p>
              </div>
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/cyberquest" className="mini-card">
              <Icon name="gamepad" size={22} />
              <div>
                <h3>Test what you know</h3>
                <p>Try {scenarioCount} quick real-life {scenarioCount === 1 ? 'scenario' : 'scenarios'}.</p>
              </div>
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
