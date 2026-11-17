import Icon from '../Icon.jsx'

export function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {hint ? <span className="field-hint">{hint}</span> : null}
      {children}
    </label>
  )
}

export function TextField({ label, value, onChange, long = false, rows = 4, hint, placeholder }) {
  return (
    <Field label={label} hint={hint}>
      {long ? (
        <textarea
          className="input textarea"
          value={value || ''}
          rows={rows}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="input"
          type="text"
          value={value || ''}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  )
}

export function LinesField({ label, value, onChange, hint = 'One item per line.', rows = 5 }) {
  const text = Array.isArray(value) ? value.join('\n') : ''
  return (
    <Field label={label} hint={hint}>
      <textarea
        className="input textarea"
        rows={rows}
        value={text}
        onChange={(event) =>
          onChange(
            event.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
      />
    </Field>
  )
}

export function PairsField({ label, items, onChange, hint = 'A short heading and its explanation.' }) {
  const list = Array.isArray(items) ? items : []
  const update = (index, patch) => {
    onChange(list.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <span className="field-hint">{hint}</span>
      <div className="pairs">
        {list.map((item, index) => (
          <div className="pair-row" key={index}>
            <input
              className="input"
              value={item.heading || ''}
              placeholder="Heading"
              onChange={(event) => update(index, { heading: event.target.value })}
            />
            <textarea
              className="input textarea"
              rows={2}
              value={item.text || ''}
              placeholder="Explanation"
              onChange={(event) => update(index, { text: event.target.value })}
            />
            <button
              type="button"
              className="icon-btn danger"
              aria-label="Remove this section"
              onClick={() => onChange(list.filter((_, i) => i !== index))}
            >
              <Icon name="trash" size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onChange([...list, { heading: '', text: '' }])}
      >
        <Icon name="plus" size={15} /> Add section
      </button>
    </div>
  )
}

export function SaveBar({ onSave, saving, message, error, label = 'Save changes' }) {
  return (
    <div className="save-bar">
      <div className="save-status">
        {error ? (
          <span className="alert err">
            <Icon name="alert" size={15} /> {error}
          </span>
        ) : message ? (
          <span className="alert ok">
            <Icon name="check" size={15} /> {message}
          </span>
        ) : (
          <span className="muted">Changes appear on the site straight away after saving.</span>
        )}
      </div>
      <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving}>
        <Icon name="save" size={17} />
        {saving ? 'Saving…' : label}
      </button>
    </div>
  )
}

export function ItemPicker({ items, selected, onSelect, onAdd, onDelete, labelOf, addLabel = 'Add new' }) {
  return (
    <div className="picker">
      <ul className="picker-list">
        {items.map((item, index) => (
          <li key={item.id || index}>
            <button
              type="button"
              className={`picker-item${index === selected ? ' active' : ''}`}
              onClick={() => onSelect(index)}
            >
              {labelOf(item, index)}
            </button>
          </li>
        ))}
      </ul>
      <div className="picker-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onAdd}>
          <Icon name="plus" size={15} /> {addLabel}
        </button>
        {items.length > 1 ? (
          <button type="button" className="btn btn-ghost btn-sm danger-text" onClick={() => onDelete(selected)}>
            <Icon name="trash" size={15} /> Delete
          </button>
        ) : null}
      </div>
    </div>
  )
}
