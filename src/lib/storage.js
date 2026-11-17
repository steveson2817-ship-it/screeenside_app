// Browser-only storage for lesson progress and the safety checklist.
// Chat is deliberately never stored here: reopening the site always starts a fresh conversation.

export function loadList(key) {
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveList(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be blocked (private mode, school devices). Progress simply won't persist.
  }
}

export const LESSON_PROGRESS_KEY = 'screenside.lessons.v1'
export const CHECKLIST_KEY = 'screenside.checklist.v1'
