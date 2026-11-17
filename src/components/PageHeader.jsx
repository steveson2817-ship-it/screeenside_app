import Icon from './Icon.jsx'

export default function PageHeader({ eyebrow, title, lead, icon, children }) {
  return (
    <header className="page-header container">
      <div className="page-header-copy">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {lead ? <p className="lead">{lead}</p> : null}
        {children}
      </div>
      {icon ? (
        <div className="page-header-art" aria-hidden="true">
          <span className="orbit orbit-a" />
          <span className="orbit orbit-b" />
          <Icon name={icon} size={54} strokeWidth={1.4} />
        </div>
      ) : null}
    </header>
  )
}
