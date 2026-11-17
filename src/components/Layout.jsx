import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useContent } from './ContentContext.jsx'

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Learn', to: '/learn' },
  { label: 'Safety Tips', to: '/safety' },
  { label: 'CyberQuest', to: '/cyberquest' },
  { label: 'AI Chatbot', to: '/chat' },
  { label: 'Help Centre', to: '/help' },
]

function Brand({ size = 'md' }) {
  return (
    <Link to="/" className={`brand brand-${size}`} aria-label="ScreenSide home">
      <span className="brand-mark">
        <Icon name="shield" size={size === 'lg' ? 26 : 21} strokeWidth={2.1} />
      </span>
      <span className="brand-text">
        <strong>ScreenSide</strong>
        <em>Your online safety starts here.</em>
      </span>
    </Link>
  )
}

export default function Layout({ children }) {
  const { content } = useContent()
  const site = content.site
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner container">
          <Brand />

          <nav className="nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/chat" className="btn btn-primary btn-sm header-cta">
              Get help now
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name={open ? 'x' : 'menu'} size={22} />
            </button>
          </div>
        </div>

        <div id="mobile-nav" className={`mobile-nav${open ? ' open' : ''}`}>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
              >
                {item.label}
                <Icon name="arrow-right" size={18} />
              </NavLink>
            ))}
            <Link to="/chat" className="btn btn-primary mobile-cta">
              Talk to the ScreenSide guide
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="site-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Brand size="lg" />
            <p>{site.footerNote}</p>
            <span className="footer-badge">
              <Icon name="shield" size={15} /> {site.safetyReminder}
            </span>
          </div>

          <div className="footer-links">
            <h3>Explore</h3>
            <Link to="/learn">Learn</Link>
            <Link to="/safety">Safety Tips</Link>
            <Link to="/cyberquest">CyberQuest</Link>
            <Link to="/chat">AI Chatbot</Link>
            <Link to="/help">Help Centre</Link>
            <Link to="/privacy">Privacy &amp; safety</Link>
          </div>

          <div className="footer-links">
            <h3>Need help now?</h3>
            <a href="tel:112">Emergency · 112</a>
            <a href="tel:100">Police · 100</a>
            <a href="tel:1930">Cyber fraud · 1930</a>
            <a href="https://www.cybercrime.gov.in" target="_blank" rel="noreferrer noopener">
              cybercrime.gov.in
            </a>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} ScreenSide · Made for students.</p>
          <Link to="/admin" className="footer-admin">
            {site.adminHint}
          </Link>
        </div>
      </footer>
    </div>
  )
}
