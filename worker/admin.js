// Admin authentication and protected content endpoints.
// Every admin route verifies a signed, HttpOnly session cookie server-side.
import { SETUP_TOKEN } from './config.js'
import {
  json,
  fail,
  b64url,
  fromB64url,
  hmac,
  safeEqual,
  hashPassword,
  verifyPassword,
  parseCookies,
  sessionCookie,
  clearedCookie,
  isSecureRequest,
  sameOrigin,
  readJson,
} from './lib.js'
import { adminHash, setSetting, sessionSecret, getContent, saveContent } from './db.js'
import { validateContent, isContentKey, ValidationError } from './validate.js'

const SESSION_SECONDS = 60 * 60 * 12 // 12 hours

// Lightweight in-isolate throttle for password guessing.
const attempts = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

function throttled(ip) {
  const now = Date.now()
  const record = attempts.get(ip)
  if (!record || now - record.start > WINDOW_MS) {
    attempts.set(ip, { start: now, count: 0 })
    return false
  }
  return record.count >= MAX_ATTEMPTS
}

function noteAttempt(ip) {
  const record = attempts.get(ip)
  if (record) record.count += 1
}

async function issueSession(request, env) {
  const secret = await sessionSecret(env)
  const payload = b64url(
    new TextEncoder().encode(JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_SECONDS * 1000 }))
  )
  const signature = await hmac(secret, payload)
  return sessionCookie(`${payload}.${signature}`, SESSION_SECONDS, isSecureRequest(request))
}

export async function readSession(request, env) {
  const cookies = parseCookies(request)
  const raw = cookies.ss_admin
  if (!raw) return null
  const [payload, signature] = raw.split('.')
  if (!payload || !signature) return null
  try {
    const secret = await sessionSecret(env)
    const expected = await hmac(secret, payload)
    if (!safeEqual(signature, expected)) return null
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)))
    if (!data || data.role !== 'admin' || typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

async function requireAdmin(request, env) {
  const session = await readSession(request, env)
  if (!session) return null
  if (!sameOrigin(request)) return null
  return session
}

export async function handleAdmin(request, env, url) {
  const route = url.pathname
  const method = request.method

  // Public-ish status check so the admin page knows which form to show.
  if (route === '/api/admin/session' && method === 'GET') {
    const configured = Boolean(await adminHash(env))
    const session = await readSession(request, env)
    return json({ configured, authenticated: Boolean(session) })
  }

  if (route === '/api/admin/setup' && method === 'POST') {
    if (!sameOrigin(request)) return fail('Request blocked.', 403)
    if (await adminHash(env)) return fail('Admin access is already set up. Please sign in.', 409)

    let body
    try {
      body = await readJson(request)
    } catch (error) {
      return fail(error.message, 400)
    }

    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!safeEqual(token, SETUP_TOKEN)) return fail('That setup code is not correct.', 403)
    if (password.length < 10) return fail('Choose a password with at least 10 characters.', 400)
    if (password.length > 200) return fail('That password is too long.', 400)

    await setSetting(env, 'admin_hash', await hashPassword(password))
    return json({ ok: true, configured: true, authenticated: true }, 200, {
      'set-cookie': await issueSession(request, env),
    })
  }

  if (route === '/api/admin/login' && method === 'POST') {
    if (!sameOrigin(request)) return fail('Request blocked.', 403)
    const ip = request.headers.get('cf-connecting-ip') || 'local'
    if (throttled(ip)) return fail('Too many attempts. Please wait a few minutes and try again.', 429)

    let body
    try {
      body = await readJson(request)
    } catch (error) {
      return fail(error.message, 400)
    }

    const stored = await adminHash(env)
    if (!stored) return fail('Admin access has not been set up yet.', 409)

    const password = typeof body.password === 'string' ? body.password : ''
    const ok = password.length > 0 && password.length < 200 ? await verifyPassword(password, stored) : false
    if (!ok) {
      noteAttempt(ip)
      return fail('That password is not correct.', 401)
    }

    attempts.delete(ip)
    return json({ ok: true, authenticated: true }, 200, { 'set-cookie': await issueSession(request, env) })
  }

  if (route === '/api/admin/logout' && method === 'POST') {
    return json({ ok: true }, 200, { 'set-cookie': clearedCookie() })
  }

  if (route === '/api/admin/password' && method === 'POST') {
    const session = await requireAdmin(request, env)
    if (!session) return fail('You need to sign in again.', 401)

    let body
    try {
      body = await readJson(request)
    } catch (error) {
      return fail(error.message, 400)
    }

    const current = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const next = typeof body.newPassword === 'string' ? body.newPassword : ''
    const stored = await adminHash(env)
    if (!stored || !(await verifyPassword(current, stored))) return fail('Your current password is not correct.', 401)
    if (next.length < 10) return fail('Choose a password with at least 10 characters.', 400)
    if (next.length > 200) return fail('That password is too long.', 400)

    await setSetting(env, 'admin_hash', await hashPassword(next))
    return json({ ok: true })
  }

  if (route === '/api/admin/content' && method === 'PUT') {
    const session = await requireAdmin(request, env)
    if (!session) return fail('You need admin access to change the site.', 401)

    let body
    try {
      body = await readJson(request)
    } catch (error) {
      return fail(error.message, 400)
    }

    const key = typeof body.key === 'string' ? body.key : ''
    if (!isContentKey(key)) return fail('Unknown content section.', 400)

    try {
      const validated = validateContent(key, body.data)
      await saveContent(env, key, validated)
      return json({ ok: true, content: await getContent(env) })
    } catch (error) {
      if (error instanceof ValidationError) return fail(error.message, 400)
      throw error
    }
  }

  return fail('Not found.', 404)
}
