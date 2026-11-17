import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useContent } from '../components/ContentContext.jsx'
import { LESSON_PROGRESS_KEY, loadList, saveList } from '../lib/storage.js'

export default function LessonPage() {
  const { lessonId } = useParams()
  const { content } = useContent()
  const lessons = content.lessons || []
  const index = lessons.findIndex((item) => item.id === lessonId)
  const lesson = index >= 0 ? lessons[index] : null

  const [done, setDone] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setDone(loadList(LESSON_PROGRESS_KEY))
    setSelected(null)
  }, [lessonId])

  const quiz = lesson ? lesson.quiz : null
  const answered = selected !== null
  const correct = answered && quiz && selected === quiz.answerIndex

  const markDone = () => {
    if (!lesson) return
    const next = Array.from(new Set([...loadList(LESSON_PROGRESS_KEY), lesson.id]))
    saveList(LESSON_PROGRESS_KEY, next)
    setDone(next)
  }

  useEffect(() => {
    if (correct) markDone()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correct])

  const position = useMemo(() => {
    if (index < 0) return { previous: null, next: null }
    return {
      previous: index > 0 ? lessons[index - 1] : null,
      next: index < lessons.length - 1 ? lessons[index + 1] : null,
    }
  }, [index, lessons])

  if (!lesson) {
    return (
      <div className="page container section">
        <div className="empty-card">
          <h1>We could not find that lesson</h1>
          <p className="muted">It may have been renamed or removed by the site owner.</p>
          <Link to="/learn" className="btn btn-primary">
            Back to all lessons
          </Link>
        </div>
      </div>
    )
  }

  const isDone = done.includes(lesson.id)

  return (
    <div className="page lesson-page">
      <div className="container lesson-layout">
        <aside className="lesson-sidebar" aria-label="All lessons">
          <span className="eyebrow">Lessons</span>
          <ol className="lesson-list">
            {lessons.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/learn/${item.id}`}
                  className={`lesson-link${item.id === lesson.id ? ' active' : ''}`}
                >
                  <span className="lesson-link-number">{item.number}</span>
                  <span>{item.title}</span>
                  {done.includes(item.id) ? <Icon name="check" size={15} /> : null}
                </Link>
              </li>
            ))}
          </ol>
        </aside>

        <article className="lesson-main">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/learn">Learn</Link>
            <span>/</span>
            <span>Lesson {lesson.number}</span>
          </nav>

          <header className="lesson-header">
            <span className="lesson-icon lesson-icon-lg">
              <Icon name={lesson.icon} size={26} />
            </span>
            <div>
              <span className="eyebrow">{lesson.subtitle}</span>
              <h1>{lesson.title}</h1>
              <p className="lead">{lesson.summary}</p>
            </div>
          </header>

          <div className="lesson-points">
            {lesson.points.map((point, pointIndex) => (
              <section key={point.heading} className="point reveal" style={{ '--delay': `${pointIndex * 60}ms` }}>
                <span className="point-index">{pointIndex + 1}</span>
                <div>
                  <h2>{point.heading}</h2>
                  <p>{point.text}</p>
                </div>
              </section>
            ))}
          </div>

          {lesson.examples && lesson.examples.length ? (
            <section className="example-block">
              <h2>What it can look like</h2>
              <ul className="example-list">
                {lesson.examples.map((example) => (
                  <li key={example}>
                    <Icon name="arrow-right" size={15} />
                    {example}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {lesson.takeaway ? (
            <aside className="takeaway">
              <Icon name="shield" size={20} />
              <p>{lesson.takeaway}</p>
            </aside>
          ) : null}

          {quiz ? (
            <section className="quiz" aria-label="Knowledge check">
              <div className="quiz-head">
                <span className="badge">
                  <Icon name="help" size={15} /> Knowledge check
                </span>
                <h2>{quiz.question}</h2>
              </div>
              <div className="quiz-options">
                {quiz.options.map((option, optionIndex) => {
                  let state = ''
                  if (answered) {
                    if (optionIndex === quiz.answerIndex) state = ' correct'
                    else if (optionIndex === selected) state = ' wrong'
                  }
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`quiz-option${state}${selected === optionIndex ? ' selected' : ''}`}
                      onClick={() => setSelected(optionIndex)}
                      disabled={answered}
                    >
                      <span className="quiz-letter">{String.fromCharCode(65 + optionIndex)}</span>
                      <span>{option}</span>
                      {answered && optionIndex === quiz.answerIndex ? <Icon name="check" size={18} /> : null}
                      {answered && optionIndex === selected && optionIndex !== quiz.answerIndex ? (
                        <Icon name="x" size={18} />
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {answered ? (
                <div className={`quiz-feedback${correct ? ' ok' : ' retry'}`} role="status">
                  <strong>{correct ? 'That’s right.' : 'Not quite — here’s the idea.'}</strong>
                  <p>{quiz.explanation}</p>
                  {!correct ? (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>
                      <Icon name="reset" size={15} /> Try again
                    </button>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="lesson-footer">
            <button
              type="button"
              className={`btn ${isDone ? 'btn-ghost' : 'btn-secondary'}`}
              onClick={markDone}
              disabled={isDone}
            >
              <Icon name="check" size={17} />
              {isDone ? 'Lesson complete' : 'Mark as complete'}
            </button>

            <div className="lesson-nav">
              {position.previous ? (
                <Link to={`/learn/${position.previous.id}`} className="btn btn-ghost">
                  <Icon name="arrow-left" size={17} />
                  Previous
                </Link>
              ) : null}
              {position.next ? (
                <Link to={`/learn/${position.next.id}`} className="btn btn-primary">
                  Next lesson
                  <Icon name="arrow-right" size={17} />
                </Link>
              ) : (
                <Link to="/cyberquest" className="btn btn-primary">
                  Try CyberQuest
                  <Icon name="gamepad" size={17} />
                </Link>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
