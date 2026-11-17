import { useState } from 'react'
import Icon from '../Icon.jsx'
import { Field, ItemPicker, LinesField, PairsField, SaveBar, TextField } from './Forms.jsx'

function blankLesson(number) {
  return {
    id: `lesson-${Date.now().toString(36)}`,
    number,
    icon: 'sparkles',
    title: 'New lesson',
    subtitle: 'Short description',
    summary: '',
    points: [{ heading: '', text: '' }],
    examples: [],
    takeaway: '',
    quiz: { question: '', options: ['', '', ''], answerIndex: 0, explanation: '' },
  }
}

export default function LessonsEditor({ value, onSave, saving, message, error }) {
  const [lessons, setLessons] = useState(Array.isArray(value) ? value : [])
  const [selected, setSelected] = useState(0)
  const lesson = lessons[selected]

  const update = (patch) => {
    setLessons((current) => current.map((item, index) => (index === selected ? { ...item, ...patch } : item)))
  }

  const updateQuiz = (patch) => update({ quiz: { ...lesson.quiz, ...patch } })

  if (!lesson) {
    return (
      <div className="admin-panel">
        <p className="muted">There are no lessons yet.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setLessons([blankLesson(1)])
            setSelected(0)
          }}
        >
          <Icon name="plus" size={16} /> Create the first lesson
        </button>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>Lessons</h2>
        <p className="muted">Short lessons with examples and a knowledge check. Students cannot edit these.</p>
      </div>

      <div className="admin-split">
        <ItemPicker
          items={lessons}
          selected={selected}
          onSelect={setSelected}
          onAdd={() => {
            setLessons((current) => [...current, blankLesson(current.length + 1)])
            setSelected(lessons.length)
          }}
          onDelete={(index) => {
            setLessons((current) => current.filter((_, i) => i !== index))
            setSelected(0)
          }}
          labelOf={(item, index) => `${index + 1}. ${item.title}`}
          addLabel="Add lesson"
        />

        <div className="editor-form">
          <div className="form-grid two">
            <TextField label="Title" value={lesson.title} onChange={(text) => update({ title: text })} />
            <TextField label="Subtitle" value={lesson.subtitle} onChange={(text) => update({ subtitle: text })} />
            <TextField
              label="Icon"
              hint="shield, book, heart, search, sparkles, lifebuoy, layers"
              value={lesson.icon}
              onChange={(text) => update({ icon: text })}
            />
            <Field label="Lesson number">
              <input
                className="input"
                type="number"
                min="1"
                value={lesson.number}
                onChange={(event) => update({ number: Number(event.target.value) || 1 })}
              />
            </Field>
          </div>

          <TextField label="Summary" long rows={3} value={lesson.summary} onChange={(text) => update({ summary: text })} />
          <PairsField label="Lesson sections" items={lesson.points} onChange={(points) => update({ points })} />
          <LinesField
            label="Examples"
            hint="One example per line."
            value={lesson.examples}
            onChange={(examples) => update({ examples })}
          />
          <TextField
            label="Takeaway"
            long
            rows={2}
            value={lesson.takeaway}
            onChange={(text) => update({ takeaway: text })}
          />

          <div className="sub-panel">
            <h3>Knowledge check</h3>
            <TextField
              label="Question"
              long
              rows={2}
              value={lesson.quiz.question}
              onChange={(text) => updateQuiz({ question: text })}
            />

            <div className="field">
              <span className="field-label">Answers</span>
              <span className="field-hint">Select the circle next to the correct answer.</span>
              <div className="option-rows">
                {lesson.quiz.options.map((option, index) => (
                  <div className="option-row" key={index}>
                    <input
                      type="radio"
                      name="lesson-answer"
                      checked={lesson.quiz.answerIndex === index}
                      onChange={() => updateQuiz({ answerIndex: index })}
                      aria-label={`Mark answer ${index + 1} as correct`}
                    />
                    <input
                      className="input"
                      value={option}
                      placeholder={`Answer ${index + 1}`}
                      onChange={(event) =>
                        updateQuiz({
                          options: lesson.quiz.options.map((item, i) => (i === index ? event.target.value : item)),
                        })
                      }
                    />
                    {lesson.quiz.options.length > 2 ? (
                      <button
                        type="button"
                        className="icon-btn danger"
                        aria-label="Remove answer"
                        onClick={() => {
                          const options = lesson.quiz.options.filter((_, i) => i !== index)
                          const answerIndex = Math.min(lesson.quiz.answerIndex, options.length - 1)
                          updateQuiz({ options, answerIndex })
                        }}
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => updateQuiz({ options: [...lesson.quiz.options, ''] })}
              >
                <Icon name="plus" size={15} /> Add answer
              </button>
            </div>

            <TextField
              label="Explanation shown after answering"
              long
              rows={3}
              value={lesson.quiz.explanation}
              onChange={(text) => updateQuiz({ explanation: text })}
            />
          </div>

          <SaveBar onSave={() => onSave('lessons', lessons)} saving={saving} message={message} error={error} />
        </div>
      </div>
    </div>
  )
}
