import { site, features, privacyPoints } from './site.js'
import { lessonsBasics } from './lessons-basics.js'
import { lessonsActions } from './lessons-actions.js'
import { tips, checklist } from './tips.js'
import { quest } from './quest.js'
import { help, helpSteps, emergencyNote } from './help.js'

// Single source of truth for editable content. Used to seed the database and as an offline fallback.
export const defaultContent = {
  site,
  lessons: [...lessonsBasics, ...lessonsActions],
  tips,
  quest,
  help,
}

export const extras = {
  features,
  privacyPoints,
  checklist,
  helpSteps,
  emergencyNote,
}
