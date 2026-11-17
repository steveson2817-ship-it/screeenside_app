// Server-side validation for admin content updates. Content is rendered as text by React,
// so the goal here is shape, size limits and link safety rather than HTML sanitising.
import { defaultContent } from '../src/content/index.js'

export class ValidationError extends Error {}

function text(value, max, label) {
  if (typeof value !== 'string') throw new ValidationError(`${label} must be text.`)
  const trimmed = value.trim()
  if (trimmed.length > max) throw new ValidationError(`${label} is too long (max ${max} characters).`)
  return trimmed
}

function required(value, max, label) {
  const out = text(value, max, label)
  if (!out) throw new ValidationError(`${label} cannot be empty.`)
  return out
}

function id(value) {
  const out = required(value, 60, 'Id')
  if (!/^[a-z0-9-]+$/.test(out)) throw new ValidationError('Ids can only use lowercase letters, numbers and hyphens.')
  return out
}

function icon(value) {
  const out = text(value, 40, 'Icon')
  return /^[a-z0-9-]+$/.test(out) ? out : 'sparkles'
}

function list(value, max, label) {
  if (!Array.isArray(value)) throw new ValidationError(`${label} must be a list.`)
  if (value.length > max) throw new ValidationError(`${label} can have at most ${max} items.`)
  return value
}

function link(value) {
  const href = text(value, 400, 'Link')
  if (!href) return ''
  let parsed
  try {
    parsed = new URL(href)
  } catch {
    throw new ValidationError('Links must be full web addresses starting with https:// or a tel: number.')
  }
  if (!['https:', 'http:', 'tel:', 'mailto:'].includes(parsed.protocol)) {
    throw new ValidationError('Links must use https://, http://, mailto: or tel:.')
  }
  return href
}

function boolean(value) {
  return value === true
}

function validateSite(value) {
  const base = defaultContent.site
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ValidationError('Site settings must be an object.')
  const out = {}
  Object.keys(base).forEach((key) => {
    const max = key === 'tagline' ? 120 : key === 'name' ? 40 : 1500
    out[key] = required(value[key] !== undefined ? value[key] : base[key], max, key)
  })
  return out
}

function validateLessons(value) {
  return list(value, 24, 'Lessons').map((lesson, index) => {
    if (!lesson || typeof lesson !== 'object') throw new ValidationError(`Lesson ${index + 1} is not valid.`)
    const quiz = lesson.quiz || {}
    const options = list(quiz.options || [], 6, 'Quiz options').map((option, i) =>
      required(option, 240, `Lesson ${index + 1} quiz option ${i + 1}`)
    )
    if (options.length < 2) throw new ValidationError(`Lesson ${index + 1} needs at least two quiz options.`)
    const answerIndex = Number(quiz.answerIndex)
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) {
      throw new ValidationError(`Lesson ${index + 1} needs a valid correct answer.`)
    }
    return {
      id: id(lesson.id),
      number: Number(lesson.number) || index + 1,
      icon: icon(lesson.icon),
      title: required(lesson.title, 140, `Lesson ${index + 1} title`),
      subtitle: text(lesson.subtitle, 140, `Lesson ${index + 1} subtitle`),
      summary: required(lesson.summary, 700, `Lesson ${index + 1} summary`),
      points: list(lesson.points || [], 10, `Lesson ${index + 1} sections`).map((point) => ({
        heading: required(point && point.heading, 140, 'Section heading'),
        text: required(point && point.text, 900, 'Section text'),
      })),
      examples: list(lesson.examples || [], 12, `Lesson ${index + 1} examples`).map((example) =>
        required(example, 320, 'Example')
      ),
      takeaway: text(lesson.takeaway, 700, `Lesson ${index + 1} takeaway`),
      quiz: {
        question: required(quiz.question, 400, `Lesson ${index + 1} quiz question`),
        options,
        answerIndex,
        explanation: required(quiz.explanation, 800, `Lesson ${index + 1} quiz explanation`),
      },
    }
  })
}

function validateTips(value) {
  return list(value, 24, 'Tips').map((tip, index) => {
    if (!tip || typeof tip !== 'object') throw new ValidationError(`Tip ${index + 1} is not valid.`)
    return {
      id: id(tip.id),
      icon: icon(tip.icon),
      title: required(tip.title, 140, `Tip ${index + 1} title`),
      summary: required(tip.summary, 400, `Tip ${index + 1} summary`),
      points: list(tip.points || [], 10, `Tip ${index + 1} points`).map((point) =>
        required(point, 400, `Tip ${index + 1} point`)
      ),
    }
  })
}

function validateQuest(value) {
  return list(value, 24, 'Scenarios').map((scenario, index) => {
    if (!scenario || typeof scenario !== 'object') throw new ValidationError(`Scenario ${index + 1} is not valid.`)
    const options = list(scenario.options || [], 5, `Scenario ${index + 1} answers`).map((option, i) => ({
      text: required(option && option.text, 320, `Scenario ${index + 1} answer ${i + 1}`),
      correct: boolean(option && option.correct),
      feedback: required(option && option.feedback, 600, `Scenario ${index + 1} feedback ${i + 1}`),
    }))
    if (options.length < 2) throw new ValidationError(`Scenario ${index + 1} needs at least two answers.`)
    if (!options.some((option) => option.correct)) throw new ValidationError(`Scenario ${index + 1} needs one correct answer.`)
    return {
      id: id(scenario.id),
      situation: required(scenario.situation, 700, `Scenario ${index + 1} situation`),
      options,
      explanation: required(scenario.explanation, 800, `Scenario ${index + 1} explanation`),
    }
  })
}

function validateHelp(value) {
  return list(value, 20, 'Help options').map((item, index) => {
    if (!item || typeof item !== 'object') throw new ValidationError(`Help option ${index + 1} is not valid.`)
    const actionType = ['phone', 'link', 'none'].includes(item.actionType) ? item.actionType : 'none'
    return {
      id: id(item.id),
      icon: icon(item.icon),
      title: required(item.title, 140, `Help option ${index + 1} title`),
      value: required(item.value, 160, `Help option ${index + 1} value`),
      description: required(item.description, 900, `Help option ${index + 1} description`),
      actionType,
      actionLabel: text(item.actionLabel, 100, `Help option ${index + 1} button label`),
      href: actionType === 'none' ? '' : link(item.href),
      urgent: boolean(item.urgent),
    }
  })
}

const validators = {
  site: validateSite,
  lessons: validateLessons,
  tips: validateTips,
  quest: validateQuest,
  help: validateHelp,
}

export function validateContent(key, data) {
  const validator = validators[key]
  if (!validator) throw new ValidationError('Unknown content section.')
  return validator(data)
}

export function isContentKey(key) {
  return Object.prototype.hasOwnProperty.call(validators, key)
}
