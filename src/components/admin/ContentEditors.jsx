import { useState } from 'react'
import Icon from '../Icon.jsx'
import { Field, ItemPicker, LinesField, SaveBar, TextField } from './Forms.jsx'

const ICON_HINT = 'shield, lock, settings, user-x, message, ban, image, key, share, siren, globe, instagram, users'

export function TipsEditor({ value, onSave, saving, message, error }) {
  const [tips, setTips] = useState(value)
  const [selected, setSelected] = useState(0)
  const tip = tips[selected]

  const update = (patch) =>
    setTips((current) => current.map((item, index) => (index === selected ? { ...item, ...patch } : item)))

  if (!tip) return <p className="muted">No tips yet.</p>

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>Safety tips</h2>
        <p className="muted">The cards students see on the Safety Tips page.</p>
      </div>

      <div className="admin-split">
        <ItemPicker
          items={tips}
          selected={selected}
          onSelect={setSelected}
          onAdd={() => {
            setTips((current) => [
              ...current,
              { id: `tip-${Date.now().toString(36)}`, icon: 'shield', title: 'New tip', summary: '', points: [] },
            ])
            setSelected(tips.length)
          }}
          onDelete={(index) => {
            setTips((current) => current.filter((_, i) => i !== index))
            setSelected(0)
          }}
          labelOf={(item) => item.title}
          addLabel="Add tip"
        />

        <div className="editor-form">
          <div className="form-grid two">
            <TextField label="Title" value={tip.title} onChange={(text) => update({ title: text })} />
            <TextField label="Icon" hint={ICON_HINT} value={tip.icon} onChange={(text) => update({ icon: text })} />
          </div>
          <TextField label="Summary" long rows={2} value={tip.summary} onChange={(text) => update({ summary: text })} />
          <LinesField
            label="Bullet points"
            hint="One point per line."
            value={tip.points}
            onChange={(points) => update({ points })}
          />
          <SaveBar onSave={() => onSave('tips', tips)} saving={saving} message={message} error={error} />
        </div>
      </div>
    </div>
  )
}

export function QuestEditor({ value, onSave, saving, message, error }) {
  const [scenarios, setScenarios] = useState(value)
  const [selected, setSelected] = useState(0)
  const scenario = scenarios[selected]

  const update = (patch) =>
    setScenarios((current) => current.map((item, index) => (index === selected ? { ...item, ...patch } : item)))

  if (!scenario) return <p className="muted">No scenarios yet.</p>

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>CyberQuest scenarios</h2>
        <p className="muted">Each scenario needs at least two answers, with exactly one marked correct.</p>
      </div>

      <div className="admin-split">
        <ItemPicker
          items={scenarios}
          selected={selected}
          onSelect={setSelected}
          onAdd={() => {
            setScenarios((current) => [
              ...current,
              {
                id: `scenario-${Date.now().toString(36)}`,
                situation: '',
                options: [
                  { text: '', correct: true, feedback: '' },
                  { text: '', correct: false, feedback: '' },
                ],
                explanation: '',
              },
            ])
            setSelected(scenarios.length)
          }}
          onDelete={(index) => {
            setScenarios((current) => current.filter((_, i) => i !== index))
            setSelected(0)
          }}
          labelOf={(item, index) => `Scenario ${index + 1}`}
          addLabel="Add scenario"
        />

        <div className="editor-form">
          <TextField
            label="Situation"
            long
            rows={3}
            value={scenario.situation}
            onChange={(text) => update({ situation: text })}
          />

          <div className="field">
            <span className="field-label">Answers</span>
            <span className="field-hint">Mark the best answer, and explain why the others fall short.</span>
            <div className="option-rows">
              {scenario.options.map((option, index) => (
                <div className="option-block" key={index}>
                  <div className="option-row">
                    <input
                      type="radio"
                      name="quest-answer"
                      checked={Boolean(option.correct)}
                      onChange={() =>
                        update({
                          options: scenario.options.map((item, i) => ({ ...item, correct: i === index })),
                        })
                      }
                      aria-label={`Mark answer ${index + 1} as the best choice`}
                    />
                    <input
                      className="input"
                      value={option.text}
                      placeholder={`Answer ${index + 1}`}
                      onChange={(event) =>
                        update({
                          options: scenario.options.map((item, i) =>
                            i === index ? { ...item, text: event.target.value } : item
                          ),
                        })
                      }
                    />
                    {scenario.options.length > 2 ? (
                      <button
                        type="button"
                        className="icon-btn danger"
                        aria-label="Remove answer"
                        onClick={() =>
                          update({ options: scenario.options.filter((_, i) => i !== index) })
                        }
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    ) : null}
                  </div>
                  <textarea
                    className="input textarea"
                    rows={2}
                    value={option.feedback}
                    placeholder="Feedback for choosing this answer"
                    onChange={(event) =>
                      update({
                        options: scenario.options.map((item, i) =>
                          i === index ? { ...item, feedback: event.target.value } : item
                        ),
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                update({ options: [...scenario.options, { text: '', correct: false, feedback: '' }] })
              }
            >
              <Icon name="plus" size={15} /> Add answer
            </button>
          </div>

          <TextField
            label="Explanation after answering"
            long
            rows={3}
            value={scenario.explanation}
            onChange={(text) => update({ explanation: text })}
          />

          <SaveBar onSave={() => onSave('quest', scenarios)} saving={saving} message={message} error={error} />
        </div>
      </div>
    </div>
  )
}

export function HelpEditor({ value, onSave, saving, message, error }) {
  const [items, setItems] = useState(value)
  const [selected, setSelected] = useState(0)
  const item = items[selected]

  const update = (patch) =>
    setItems((current) => current.map((entry, index) => (index === selected ? { ...entry, ...patch } : entry)))

  if (!item) return <p className="muted">No help options yet.</p>

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>Help Centre</h2>
        <p className="muted">
          Only add phone numbers and links you have verified. Wrong numbers can send students somewhere unhelpful.
        </p>
      </div>

      <div className="admin-split">
        <ItemPicker
          items={items}
          selected={selected}
          onSelect={setSelected}
          onAdd={() => {
            setItems((current) => [
              ...current,
              {
                id: `help-${Date.now().toString(36)}`,
                icon: 'lifebuoy',
                title: 'New help option',
                value: '',
                description: '',
                actionType: 'none',
                actionLabel: '',
                href: '',
                urgent: false,
              },
            ])
            setSelected(items.length)
          }}
          onDelete={(index) => {
            setItems((current) => current.filter((_, i) => i !== index))
            setSelected(0)
          }}
          labelOf={(entry) => entry.title}
          addLabel="Add option"
        />

        <div className="editor-form">
          <div className="form-grid two">
            <TextField label="Title" value={item.title} onChange={(text) => update({ title: text })} />
            <TextField label="Icon" hint={ICON_HINT} value={item.icon} onChange={(text) => update({ icon: text })} />
          </div>

          <TextField
            label="Displayed value"
            hint="The number or handle, shown large on the card."
            value={item.value}
            onChange={(text) => update({ value: text })}
          />

          <TextField
            label="Description"
            long
            rows={4}
            value={item.description}
            onChange={(text) => update({ description: text })}
          />

          <div className="form-grid two">
            <Field label="Button type">
              <select
                className="input"
                value={item.actionType}
                onChange={(event) => update({ actionType: event.target.value })}
              >
                <option value="none">No button</option>
                <option value="phone">Phone call</option>
                <option value="link">Web link</option>
              </select>
            </Field>
            <TextField
              label="Button label"
              value={item.actionLabel}
              onChange={(text) => update({ actionLabel: text })}
            />
          </div>

          {item.actionType !== 'none' ? (
            <TextField
              label={item.actionType === 'phone' ? 'Phone link' : 'Web address'}
              hint={item.actionType === 'phone' ? 'Example: tel:1930' : 'Must start with https://'}
              value={item.href}
              onChange={(text) => update({ href: text })}
            />
          ) : null}

          <label className="check-inline">
            <input
              type="checkbox"
              checked={Boolean(item.urgent)}
              onChange={(event) => update({ urgent: event.target.checked })}
            />
            <span>Highlight this as an urgent option</span>
          </label>

          <SaveBar onSave={() => onSave('help', items)} saving={saving} message={message} error={error} />
        </div>
      </div>
    </div>
  )
}
