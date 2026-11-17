import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../components/ContentContext.jsx'
import { LESSON_PROGRESS_KEY, loadList } from '../lib/storage.js'

export default function Learn() {
  const { content } = useContent()
  const lessons = content.lessons || []
  const [done, setDone] = useState([])

  useEffect(() => {
    setDone(loadList(LESSON_PROGRESS_KEY))
  }, [])

  const completed = lessons.filter((lesson) => done.includes(lesson.id)).length
  const percent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0

  return (
    <div className="page">
      <PageHeader
        eyebrow="Learn"
        title="Understanding cyberbullying, one short lesson at a time"
        lead={`${lessons.length} short ${lessons.length === 1 ? 'lesson' : 'lessons'} with real examples and a quick knowledge check. Read them in order or jump to whatever you need.`}
        icon="book"
      />

      <section className="container section-tight">
        <div className="progress-card">
          <div className="progress-copy">
            <strong>
              {completed} of {lessons.length} lessons explored
            </strong>
            <span className="muted">Your progress is saved only in this browser.</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="lesson-grid">
          {lessons.map((lesson, index) => {
            const isDone = done.includes(lesson.id)
            return (
              <Link
                key={lesson.id}
                to={`/learn/${lesson.id}`}
                className="lesson-card reveal"
                style={{ '--delay': `${index * 60}ms` }}
              >
                <div className="lesson-card-top">
                  <span className="lesson-number">Lesson {lesson.number}</span>
                  {isDone ? (
                    <span className="done-pill">
                      <Icon name="check" size={14} /> Done
                    </span>
                  ) : (
                    <span className="lesson-icon">
                      <Icon name={lesson.icon} size={20} />
                    </span>
                  )}
                </div>
                <h2>{lesson.title}</h2>
                <p>{lesson.summary}</p>
                <span className="lesson-cta">
                  {isDone ? 'Review lesson' : 'Start lesson'}
                  <Icon name="arrow-right" size={16} />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="inline-cta">
          <div>
            <h2>Want to talk it through instead?</h2>
            <p className="muted">The ScreenSide guide can answer a question in plain English, any time.</p>
          </div>
          <Link to="/chat" className="btn btn-primary">
            <Icon name="chat" size={18} />
            Ask the guide
          </Link>
        </div>
      </section>
    </div>
  )
}
