// Admin authentication and protected content endpoints.
// Every admin route verifies a signed, HttpOnly session cookie server-side.
import {
  json,
  fail,
  b64url,
  fromB64url,
  hmac,
  safeEqual,
  sha256Hex,
  hashPassword,
  verifyPassword,
  parseCookies,
  sessionCookie,
  clearedCookie,
  isSecureRequest,
  sameOrigin,
  readJson,
  clientIp,
} from './lib.js'
import {
  adminHash,
  claimAdminHash,
  setSetting,
  sessionSecret,
  sessionVersion,
  bumpSessionVersion,
  getContent,
  saveContent,
  loginBlocked,
  recordFailedLogin,
  clearFailedLogins,
} from './db.js'
import { validateContent, isContentKey, ValidationError } from './validate.js'

const SESSION_SECONDS = 60 * 60 * 12 // 12 hours

// The one-time setup code is a Worker secret, never source code:
//   npx wrangler secret put SETUP_TOKEN        (production)
//   SETUP_TOKEN=... in .dev.vars                (local development)
function setupToken(env) {
  const token = env && typeof env.SETUP_TOKEN === 'string' ? env.SETUP_TOKEN.trim() : ''
  return token.length >= 12 ? token : ''
}

async function issueSession(request, env, version) {
  const secret = await sessionSecret(env)
  const v = version || (await sessionVersion(env))
  const payload = b64url(
    new TextEncoder().encode(JSON.stringify({ role: 'admin', v, exp: Date.now() + SESSION_SECONDS * 1000 }))
  )
  const signature = await hmac(secret, payload)
  return sessionCookie(`${payload}.${signature}`, SESSION_SECONDS, isSecureRequest(request))
}

export async function readSession(request, env) {
  const raw = parseCookies(request).ss_admin
  if (!raw) return null
  const [payload, signature] = raw.split('.')
  if (!payload || !signature) return null
  try {
    const secret = await sessionSecret(env)
    const expected = await hmac(secret, payload)
    if (!safeEqual(signature, expected)) return null
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload)))
    if (!data || data.role !== 'admin' || typeof data.exp !== 'number' || data.exp < Date.now()) return null
    // Sessions from before the last sign-out or password change are no longer valid.
    if (String(data.v) !== (await sessionVersion(env))) return null
    return data
  } catch {
    return null
  }
}

async function requireAdmin(request, env) {
  if (!sameOrigin(request)) return null
  return readSession(request, env)
}

async function ipKey(request, env) {
  return sha256Hex(`login|${clientIp(request)}|${await sessionSecret(env)}`)
}

export async function handleAdmin(request, env, url) {
  const route = url.pathname
  const method = request.method

  // Public-ish status check so the admin page knows which form to show.
  if (route === '/api/admin/session' && method === 'GET') {
    const configured = Boolean(await adminHash(env))
    const session = await readSession(request, env)
    return json({ configured, authenticated: Boolean(session), setupAvailable: Boolean(setupToken(env)) })
  }

  if (route === '/api/admin/setup' && method === 'POST') {
    if (!sameOrigin(request)) return fail('Request blocked.', 403)
    if (await adminHash(env)) return fail('Admin access is already set up. Please sign in.', 409)

    const expectedToken = setupToken(env)
    if (!expectedToken) {
      return fail('Admin setup is switched off. The site owner needs to set the SETUP_TOKEN secret first.', 503)
    }

    const key = await ipKey(request, env)
    if (await loginBlocked(env, key)) return fail('Too many attempts. Please wait a few minutes and try again.', 429)

    let body
    try {
      body = await readJson(request, 4000)
    } catch (error) {
      return fail(error.message, 400)
    }

    const token = typeof body.token === 'string' ? body.token.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!safeEqual(token, expectedToken)) {
      await recordFailedLogin(env, key)
      return fail('That setup code is not correct.', 403)
    }
    if (password.length < 10) return fail('Choose a password with at least 10 characters.', 400)
    if (password.length > 200) return fail('That password is too long.', 400)

    const claimed = await claimAdminHash(env, await hashPassword(password))
    if (!claimed) return fail('Admin access is already set up. Please sign in.', 409)

    await clearFailedLogins(env, key)
    return json({ ok: true, configured: true, authenticated: true }, 200, {
      'set-cookie': await issueSession(request, env),
    })
  }

  if (route === '/api/admin/login' && method === 'POST') {
    if (!sameOrigin(request)) return fail('Request blocked.', 403)
    const key = await ipKey(request, env)
    if (await loginBlocked(env, key)) return fail('Too many attempts. Please wait a few minutes and try again.', 429)

    let body
    try {
      body = await readJson(request, 4000)
    } catch (error) {
      return fail(error.message, 400)
    }

    const stored = await adminHash(env)
    if (!stored) return fail('Admin access has not been set up yet.', 409)

    const password = typeof body.password === 'string' ? body.password : ''
    const ok = password.length > 0 && password.length <= 200 ? await verifyPassword(password, stored) : false
    if (!ok) {
      await recordFailedLogin(env, key)
      return fail('That password is not correct.', 401)
    }

    await clearFailedLogins(env, key)
    return json({ ok: true, authenticated: true }, 200, { 'set-cookie': await issueSession(request, env) })
  }

  if (route === '/api/admin/logout' && method === 'POST') {
    // Signing out revokes the token itself, not just this browser's copy of it.
    if (await requireAdmin(request, env)) await bumpSessionVersion(env)
    return json({ ok: true }, 200, { 'set-cookie': clearedCookie() })
  }

  if (route === '/api/admin/password' && method === 'POST') {
    const session = await requireAdmin(request, env)
    if (!session) return fail('Your session has ended. Please sign in again.', 401)

    let body
    try {
      body = await readJson(request, 4000)
    } catch (error) {
      return fail(error.message, 400)
    }

    const current = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const next = typeof body.newPassword === 'string' ? body.newPassword : ''
    const stored = await adminHash(env)
    if (!stored || !(await verifyPassword(current, stored))) return fail('Your current password is not correct.', 400)
    if (next.length < 10) return fail('Choose a password with at least 10 characters.', 400)
    if (next.length > 200) return fail('That password is too long.', 400)

    await setSetting(env, 'admin_hash', await hashPassword(next))
    // Sign out every other session, and keep this one signed in with a fresh cookie.
    const version = await bumpSessionVersion(env)
    return json({ ok: true }, 200, { 'set-cookie': await issueSession(request, env, version) })
  }

  if (route === '/api/admin/content' && method === 'PUT') {
    const session = await requireAdmin(request, env)
    if (!session) return fail('Your session has ended. Please sign in again.', 401)

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
