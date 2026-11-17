import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { useContent } from '../components/ContentContext.jsx'

export default function Quest() {
  const { content } = useContent()
  const scenarios = content.quest || []

  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const current = scenarios[index]
  const total = scenarios.length
  const score = useMemo(() => answers.filter((answer) => answer.correct).length, [answers])

  const start = () => {
    setStarted(true)
    setIndex(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  const choose = (optionIndex) => {
    if (selected !== null) return
    setSelected(optionIndex)
    const option = current.options[optionIndex]
    setAnswers((previous) => [...previous, { scenarioId: current.id, optionIndex, correct: Boolean(option.correct) }])
  }

  const next = () => {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  if (!total) {
    return (
      <div className="page container section">
        <div className="empty-card">
          <h1>CyberQuest is being updated</h1>
          <p className="muted">The site owner is adding new scenarios. Please check back soon.</p>
          <Link to="/learn" className="btn btn-primary">
            Try the lessons instead
          </Link>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="page">
        <PageHeader
          eyebrow="CyberQuest"
          title="What would you actually do?"
          lead="Eight fictional online situations. Pick the response you think is best, and find out why it works."
          icon="gamepad"
        />
        <section className="container section-tight">
          <div className="quest-intro">
            <div className="quest-intro-art" aria-hidden="true">
              <Icon name="gamepad" size={56} strokeWidth={1.3} />
            </div>
            <div>
              <h2>{total} quick scenarios</h2>
              <ul className="quest-rules">
                <li>
                  <Icon name="check" size={16} /> Every answer comes with an explanation.
                </li>
                <li>
                  <Icon name="check" size={16} /> Nobody sees your score — it stays in this page.
                </li>
                <li>
                  <Icon name="check" size={16} /> These are made-up situations, not real people.
                </li>
                <li>
                  <Icon name="check" size={16} /> You will not be asked to share your own experiences.
                </li>
              </ul>
              <button type="button" className="btn btn-primary btn-lg" onClick={start}>
                Start CyberQuest
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (finished) {
    const percent = Math.round((score / total) * 100)
    const message =
      percent >= 80
        ? 'Brilliant — you have a really strong sense of what helps online.'
        : percent >= 50
          ? 'Good going. A couple of ideas to revisit, and you are well on your way.'
          : 'Thanks for giving it a go. The Learn section will make these choices much clearer.'

    return (
      <div className="page">
        <PageHeader eyebrow="CyberQuest" title="Quest complete" icon="trophy" />
        <section className="container section-tight">
          <div className="result-card">
            <span className="result-badge">
              <Icon name="trophy" size={30} />
            </span>
            <h2>
              You scored {score} out of {total}
            </h2>
            <p className="lead">{message}</p>
            <div className="progress-track">
              <span style={{ width: `${percent}%` }} />
            </div>

            <div className="result-list">
              {answers.map((answer, answerIndex) => {
                const scenario = scenarios.find((item) => item.id === answer.scenarioId)
                return (
                  <div key={`${answer.scenarioId}-${answerIndex}`} className={`result-row${answer.correct ? ' ok' : ' miss'}`}>
                    <span className="result-icon">
                      <Icon name={answer.correct ? 'check' : 'x'} size={16} />
                    </span>
                    <div>
                      <strong>{scenario ? scenario.situation : 'Scenario'}</strong>
                      <p>{scenario ? scenario.explanation : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="result-actions">
              <button type="button" className="btn btn-primary" onClick={start}>
                <Icon name="reset" size={17} /> Play again
              </button>
              <Link to="/learn" className="btn btn-secondary">
                <Icon name="book" size={17} /> Read the lessons
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const answered = selected !== null
  const chosenOption = answered ? current.options[selected] : null

  return (
    <div className="page">
      <div className="container section-tight quest-shell">
        <div className="quest-top">
          <div className="quest-meta">
            <span className="badge">
              <Icon name="gamepad" size={15} /> Scenario {index + 1} of {total}
            </span>
            <span className="quest-score">
              <Icon name="trophy" size={16} /> Score {score}
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }} />
          </div>
        </div>

        <article className="quest-card">
          <h2>{current.situation}</h2>

          <div className="answers">
            {current.options.map((option, optionIndex) => {
              const isChosen = selected === optionIndex
              const isCorrect = option.correct
              let state = ''
              if (answered) {
                if (isCorrect) state = ' correct'
                else if (isChosen) state = ' wrong'
                else state = ' dim'
              }
              return (
                <button
                  key={option.text}
                  type="button"
                  className={`answer${state}${isChosen ? ' chosen' : ''}`}
                  onClick={() => choose(optionIndex)}
                  disabled={answered}
                >
                  <span className="answer-letter">{String.fromCharCode(65 + optionIndex)}</span>
                  <span className="answer-text">{option.text}</span>
                  {answered && isCorrect ? <Icon name="check" size={18} /> : null}
                  {answered && isChosen && !isCorrect ? <Icon name="x" size={18} /> : null}
                </button>
              )
            })}
          </div>

          {answered ? (
            <div className={`quest-feedback${chosenOption.correct ? ' ok' : ' retry'}`} role="status">
              <strong>{chosenOption.correct ? 'That’s the strongest choice.' : 'Here’s what would work better.'}</strong>
              <p>{chosenOption.feedback}</p>
              <p className="quest-why">
                <Icon name="heart" size={15} /> {current.explanation}
              </p>
              <button type="button" className="btn btn-primary" onClick={next}>
                {index + 1 >= total ? 'See my result' : 'Next scenario'}
                <Icon name="arrow-right" size={17} />
              </button>
            </div>
          ) : (
            <p className="quest-hint">Choose the answer you think is best.</p>
          )}
        </article>
      </div>
    </div>
  )
}
