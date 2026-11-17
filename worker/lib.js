// Small shared helpers for the Worker: responses, crypto, cookies and input limits.
const encoder = new TextEncoder()

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  })
}

export function fail(message, status = 400) {
  return json({ ok: false, error: message }, status)
}

export function b64url(bytes) {
  let binary = ''
  const view = new Uint8Array(bytes)
  for (let i = 0; i < view.length; i += 1) binary += String.fromCharCode(view[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function fromB64url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function randomToken(bytes = 32) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)))
}

export function randomHex(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hmac(secret, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return b64url(signature)
}

export function safeEqual(a, b) {
  const left = String(a)
  const right = String(b)
  if (left.length !== right.length) return false
  let diff = 0
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return diff === 0
}

const PBKDF2_ITERATIONS = 150000

export async function hashPassword(password) {
  const salt = randomHex(16)
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  )
  return `pbkdf2$${PBKDF2_ITERATIONS}$${salt}$${b64url(bits)}`
}

export async function verifyPassword(password, stored) {
  try {
    const parts = String(stored).split('$')
    if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false
    const iterations = Number(parts[1])
    const saltBytes = encoder.encode(parts[2])
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
      key,
      256
    )
    return safeEqual(b64url(bits), parts[3])
  } catch {
    return false
  }
}

export function parseCookies(request) {
  const header = request.headers.get('cookie') || ''
  const out = {}
  header.split(';').forEach((part) => {
    const index = part.indexOf('=')
    if (index > -1) out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim())
  })
  return out
}

export function sessionCookie(value, maxAgeSeconds, secure) {
  const bits = [
    `ss_admin=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ]
  if (secure) bits.push('Secure')
  return bits.join('; ')
}

export function clearedCookie() {
  return 'ss_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
}

export function isSecureRequest(request) {
  return new URL(request.url).protocol === 'https:'
}

// Same-origin check for state-changing admin requests (defence in depth alongside SameSite cookies).
export function sameOrigin(request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

export function clientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'local'
}

export async function readJson(request, maxBytes = 400000) {
  const text = await request.text()
  if (text.length > maxBytes) throw new Error('That request is too large.')
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid request data.')
  }
}
