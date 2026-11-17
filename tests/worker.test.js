import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateContent, ValidationError } from '../worker/validate.js'
import { parseCookies, readJson, hashPassword, verifyPassword } from '../worker/lib.js'
import { defaultContent } from '../src/content/index.js'

const clone = (value) => JSON.parse(JSON.stringify(value))

test('the built-in content passes its own validation', () => {
  for (const key of Object.keys(defaultContent)) {
    assert.doesNotThrow(() => validateContent(key, defaultContent[key]), key)
  }
})

test('duplicate ids are rejected', () => {
  const lessons = clone(defaultContent.lessons)
  lessons[1].id = lessons[0].id
  assert.throws(() => validateContent('lessons', lessons), ValidationError)

  const help = clone(defaultContent.help)
  help.push(clone(help[0]))
  assert.throws(() => validateContent('help', help), ValidationError)
})

test('help buttons need a matching link', () => {
  const noHref = clone(defaultContent.help)
  noHref[0].href = ''
  assert.throws(() => validateContent('help', noHref), /needs a phone link/)

  const webPhone = clone(defaultContent.help)
  webPhone[0].href = 'https://example.org'
  assert.throws(() => validateContent('help', webPhone), /tel:/)

  const telLink = clone(defaultContent.help)
  telLink[3].href = 'tel:1930'
  assert.throws(() => validateContent('help', telLink), /https/)
})

test('empty site fields are reported by their readable name', () => {
  const site = { ...defaultContent.site, adminHint: '   ' }
  assert.throws(() => validateContent('site', site), /Footer admin link text cannot be empty/)
})

test('a malformed cookie does not throw', () => {
  const request = new Request('https://example.org/', { headers: { cookie: 'broken=%E0%A4%A; ss_admin=abc.def' } })
  const cookies = parseCookies(request)
  assert.equal(cookies.ss_admin, 'abc.def')
  assert.equal(cookies.broken, '%E0%A4%A')
})

test('request size limit counts bytes, not characters', async () => {
  const emoji = '😀'.repeat(30) // 30 characters, 120 bytes
  const request = new Request('https://example.org/', { method: 'POST', body: JSON.stringify({ emoji }) })
  await assert.rejects(readJson(request, 100), /too large/)
})

test('password hashes verify', async () => {
  const stored = await hashPassword('correct horse battery')
  assert.equal(await verifyPassword('correct horse battery', stored), true)
  assert.equal(await verifyPassword('wrong password', stored), false)
})
