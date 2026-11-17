// D1 storage: content, settings and chat abuse counters.
import { defaultContent } from '../src/content/index.js'
import { randomToken } from './lib.js'

export const contentKeys = Object.keys(defaultContent)

let schemaReady = false

export async function ensureSchema(env) {
  if (schemaReady) return
  if (!env.DB) throw new Error('The database binding (DB) is not configured.')

  await env.DB.batch([
    env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS content (key TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL)'
    ),
    env.DB.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)'),
    env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS chat_usage (day TEXT NOT NULL, ip_hash TEXT NOT NULL, count INTEGER NOT NULL, PRIMARY KEY (day, ip_hash))'
    ),
    env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS login_attempts (ip_hash TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL)'
    ),
  ])

  for (const key of contentKeys) {
    await env.DB.prepare('INSERT OR IGNORE INTO content (key, data, updated_at) VALUES (?, ?, ?)')
      .bind(key, JSON.stringify(defaultContent[key]), Date.now())
      .run()
  }

  schemaReady = true
}

export async function getContent(env) {
  const { results } = await env.DB.prepare('SELECT key, data FROM content').all()
  const out = { ...defaultContent }
  for (const row of results || []) {
    try {
      out[row.key] = JSON.parse(row.data)
    } catch {
      // Keep the built-in copy if a row is ever unreadable.
    }
  }
  return out
}

export async function saveContent(env, key, data) {
  await env.DB.prepare(
    'INSERT INTO content (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
  )
    .bind(key, JSON.stringify(data), Date.now())
    .run()
}

export async function getSetting(env, key) {
  const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first()
  return row ? row.value : null
}

export async function setSetting(env, key, value) {
  await env.DB.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  )
    .bind(key, value)
    .run()
}

// The session signing key is created once and stored server-side, so sessions survive restarts.
export async function sessionSecret(env) {
  let secret = await getSetting(env, 'session_secret')
  if (!secret) {
    secret = randomToken(32)
    await env.DB.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('session_secret', ?)")
      .bind(secret)
      .run()
    secret = await getSetting(env, 'session_secret')
  }
  return secret
}

export async function adminHash(env) {
  return getSetting(env, 'admin_hash')
}

// Stores the first admin password only if none exists yet. Returns false if another
// request already claimed it, so two simultaneous setups can never overwrite each other.
export async function claimAdminHash(env, hash) {
  const result = await env.DB.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_hash', ?)")
    .bind(hash)
    .run()
  return Boolean(result && result.meta && result.meta.changes > 0)
}

// Sessions carry this number; bumping it signs out every existing session.
export async function sessionVersion(env) {
  return (await getSetting(env, 'session_version')) || '1'
}

export async function bumpSessionVersion(env) {
  const next = String(Number(await sessionVersion(env)) + 1)
  await setSetting(env, 'session_version', next)
  return next
}

const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8

// Failed-login counter kept in D1, so the limit holds across every Worker instance.
export async function loginBlocked(env, ipHash) {
  const row = await env.DB.prepare('SELECT window_start, count FROM login_attempts WHERE ip_hash = ?').bind(ipHash).first()
  if (!row) return false
  if (Date.now() - row.window_start > LOGIN_WINDOW_MS) return false
  return row.count >= LOGIN_MAX_ATTEMPTS
}

export async function recordFailedLogin(env, ipHash) {
  const now = Date.now()
  await env.DB.prepare(
    `INSERT INTO login_attempts (ip_hash, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(ip_hash) DO UPDATE SET
       count = CASE WHEN ? - window_start > ? THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN ? - window_start > ? THEN ? ELSE window_start END`
  )
    .bind(ipHash, now, now, LOGIN_WINDOW_MS, now, LOGIN_WINDOW_MS, now)
    .run()
}

export async function clearFailedLogins(env, ipHash) {
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip_hash = ?').bind(ipHash).run()
}

export async function recordChatUsage(env, ipHash) {
  const day = new Date().toISOString().slice(0, 10)
  // Counters are only needed for today; drop older days so the table does not grow forever.
  await env.DB.prepare('DELETE FROM chat_usage WHERE day < ?').bind(day).run()
  await env.DB.prepare(
    'INSERT INTO chat_usage (day, ip_hash, count) VALUES (?, ?, 1) ON CONFLICT(day, ip_hash) DO UPDATE SET count = count + 1'
  )
    .bind(day, ipHash)
    .run()
  const row = await env.DB.prepare('SELECT count FROM chat_usage WHERE day = ? AND ip_hash = ?').bind(day, ipHash).first()
  return row ? row.count : 1
}
