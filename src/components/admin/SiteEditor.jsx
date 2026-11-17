import { useState } from 'react'
import { SaveBar, TextField } from './Forms.jsx'

const fields = [
  { key: 'name', label: 'Site name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'heroBadge', label: 'Hero badge' },
  { key: 'heroTitle', label: 'Hero heading' },
  { key: 'heroText', label: 'Hero introduction', long: true, rows: 5 },
  { key: 'featuresTitle', label: 'Features heading' },
  { key: 'featuresText', label: 'Features introduction', long: true, rows: 3 },
  { key: 'awarenessTitle', label: 'Awareness heading' },
  { key: 'awarenessText', label: 'Awareness message', long: true, rows: 4 },
  { key: 'safetyReminder', label: 'Safety reminder' },
  { key: 'helpBannerTitle', label: 'Help banner heading' },
  { key: 'helpBannerText', label: 'Help banner text', long: true, rows: 3 },
  { key: 'helpIntro', label: 'Help Centre introduction', long: true, rows: 3 },
  { key: 'helpNote', label: 'Help Centre note (anonymous reporting)', long: true, rows: 5 },
  { key: 'privacySummary', label: 'Privacy summary', long: true, rows: 3 },
  { key: 'footerNote', label: 'Footer note', long: true, rows: 3 },
  { key: 'footerLinksTitle', label: 'Footer links heading' },
  { key: 'adminHint', label: 'Footer admin link text' },
]

export default function SiteEditor({ value, onSave, saving, message, error }) {
  const [draft, setDraft] = useState(value)
  const [dirty, setDirty] = useState(false)

  const update = (key, text) => {
    setDraft((current) => ({ ...current, [key]: text }))
    setDirty(true)
  }

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>Website text</h2>
        <p className="muted">The wording students see on the home page and Help Centre.</p>
      </div>

      <div className="form-grid">
        {fields.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            value={draft[field.key]}
            onChange={(text) => update(field.key, text)}
            long={Boolean(field.long)}
            rows={field.rows || 4}
          />
        ))}
      </div>

      <SaveBar
        onSave={async () => {
          const ok = await onSave('site', draft)
          if (ok) setDirty(false)
        }}
        saving={saving}
        message={dirty ? '' : message}
        error={error}
      />
    </div>
  )
}
