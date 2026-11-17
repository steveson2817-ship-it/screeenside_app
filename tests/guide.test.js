import { test } from 'node:test'
import assert from 'node:assert/strict'
import { guideReply } from '../worker/guide.js'

const intentOf = (...turns) =>
  guideReply(turns.map((content, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', content }))).intent

test('keywords never match inside other words', () => {
  // "stupid" contains "upi"; this used to return scam/payment advice.
  assert.equal(intentOf('they called me stupid in the group chat'), 'bullying')
  // "first" contains "fir"; this used to return police advice.
  assert.notEqual(intentOf('i got the first message yesterday'), 'police')
  // "in" starts with "i"; "maybe i" used to match "maybe in".
  assert.notEqual(intentOf('maybe in the evening'), 'self-blame')
  // "was" must not be read as "wa" (WhatsApp).
  assert.equal(intentOf('it was fun'), 'unknown')
})

test('keywords still match their common word endings', () => {
  assert.equal(intentOf('someone in free fire keeps insulting me'), 'bullying')
  assert.equal(intentOf('he is harassing me every day'), 'bullying')
  assert.equal(intentOf('someone is impersonating me'), 'fake-account')
  assert.equal(intentOf('i got scammed by a scammer'), 'scam')
  assert.equal(intentOf('i paid with upi and lost money'), 'scam')
})

test('hyphens, dots and apostrophes match the way the topic lists write them', () => {
  assert.equal(intentOf('i want to self-harm'), 'selfharm')
  assert.equal(intentOf('what is two-factor authentication'), 'definition')
  assert.equal(intentOf('how do i turn on two-factor'), 'password')
  assert.equal(intentOf('can i report on cybercrime.gov.in'), 'report')
  assert.equal(intentOf("I'm fine"), 'decline')
  assert.equal(intentOf("I don't know"), 'clarify')
  assert.equal(intentOf("I'm scared to tell my parents, they won't believe me"), 'trusted-adult')
})

test('a thank-you that contains a new question answers the question', () => {
  assert.equal(intentOf('thanks, but how do i report someone on instagram?'), 'report')
  assert.equal(intentOf('thanks!'), 'closing')
})

test('urgent topics still win over everything else', () => {
  assert.equal(intentOf('thanks, they are threatening to post my nudes'), 'blackmail')
  assert.equal(intentOf('i want to kill myself'), 'selfharm')
})

test('naming an app after a reporting question gives that app', () => {
  const reply = guideReply([
    { role: 'user', content: 'how do i report someone' },
    { role: 'assistant', content: 'Which app is it? I can give you the exact steps for that one.' },
    { role: 'user', content: 'whatsapp' },
  ])
  assert.equal(reply.intent, 'report')
  assert.match(reply.reply, /WhatsApp/)
})
