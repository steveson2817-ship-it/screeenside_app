// D1 storage: content, settings and chat abuse counters.
import { defaultContent } from '../src/content/index.js'

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
    const { randomToken } = await import('./lib.js')
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

export async function recordChatUsage(env, ipHash) {
  const day = new Date().toISOString().slice(0, 10)
  await env.DB.prepare(
    'INSERT INTO chat_usage (day, ip_hash, count) VALUES (?, ?, 1) ON CONFLICT(day, ip_hash) DO UPDATE SET count = count + 1'
  )
    .bind(day, ipHash)
    .run()
  const row = await env.DB.prepare('SELECT count FROM chat_usage WHERE day = ? AND ip_hash = ?').bind(day, ipHash).first()
  return row ? row.count : 1
}
