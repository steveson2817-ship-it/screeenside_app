import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <div className="page container section">
      <div className="empty-card">
        <span className="empty-icon">
          <Icon name="search" size={30} />
        </span>
        <h1>That page is not here</h1>
        <p className="muted">The link may be old, or the page may have moved. These pages definitely work:</p>
        <div className="empty-links">
          <Link to="/" className="btn btn-primary">
            Home
          </Link>
          <Link to="/learn" className="btn btn-secondary">
            Learn
          </Link>
          <Link to="/help" className="btn btn-secondary">
            Help Centre
          </Link>
        </div>
      </div>
    </div>
  )
}
