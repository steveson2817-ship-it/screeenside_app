// ScreenSide Guide — the built-in safety engine.
// It is the fallback when no language model is configured, and the safety net if a model call fails.
// It composes replies from pieces, varies wording turn to turn, remembers what was already said,
// follows topic changes, and admits when it does not know something.
import { OPENERS, DEFINITIONS, PLATFORM_STEPS } from './guide-kb.js'
import { CORE_TOPICS } from './guide-topics-core.js'
import { EXTRA_TOPICS } from './guide-topics-extra.js'

const TOPICS = [...CORE_TOPICS, ...EXTRA_TOPICS].sort((a, b) => b.priority - a.priority)

const YES = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'go on', 'tell me', 'yep please']
const NO = ['no', 'nope', 'no thanks', 'no thank you', 'im fine', 'i am fine']
const IDK = ['idk', 'dont know', 'not sure', 'dunno', 'no idea']

const PLATFORMS = [
  { key: 'instagram', words: ['instagram', 'insta', ' ig '] },
  { key: 'whatsapp', words: ['whatsapp', 'whats app', ' wa '] },
  { key: 'snapchat', words: ['snapchat', 'snap'] },
  { key: 'tiktok', words: ['tiktok', 'tik tok'] },
  { key: 'discord', words: ['discord'] },
  { key: 'youtube', words: ['youtube', ' yt '] },
  { key: 'game', words: ['free fire', 'bgmi', 'roblox', 'minecraft', 'valorant', 'in a game', 'game chat'] },
]

function normalise(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word))
}

// Whole-word matching for short replies, so "no" does not match "nothing".
function hasWord(text, words) {
  const tokens = text.split(' ')
  return words.some((phrase) => (phrase.includes(' ') ? text.includes(phrase) : tokens.includes(phrase)))
}

function hash(value) {
  let result = 0
  for (let i = 0; i < value.length; i += 1) result = (result * 31 + value.charCodeAt(i)) | 0
  return Math.abs(result)
}

function pick(ctx, list, salt) {
  if (!list || !list.length) return ''
  const start = hash(`${ctx.turn}|${salt}|${ctx.last}`) % list.length
  for (let i = 0; i < list.length; i += 1) {
    const candidate = list[(start + i) % list.length]
    if (!ctx.previous.includes(normalise(candidate))) return candidate
  }
  return list[start]
}

function analyse(messages) {
  const users = messages.filter((m) => m && m.role === 'user' && m.content).map((m) => normalise(m.content))
  const assistants = messages.filter((m) => m && m.role === 'assistant' && m.content).map((m) => m.content)
  const lastRaw = users.length ? messages.filter((m) => m && m.role === 'user' && m.content).slice(-1)[0].content : ''
  const previousRaw = assistants.length ? assistants[assistants.length - 1] : ''
  return {
    users,
    last: users.length ? users[users.length - 1] : '',
    lastRaw: String(lastRaw || ''),
    all: users.join(' '),
    turn: users.length,
    previousRaw,
    previous: normalise(previousRaw),
    previousIntent: users.length > 1 ? detect(users[users.length - 2]) : null,
  }
}

function detect(text) {
  if (!text) return null
  if (findDefinition(text)) return null
  const topic = TOPICS.find((entry) => hasAny(text, entry.words))
  return topic ? topic.id : null
}

function findDefinition(text) {
  for (const definition of Object.values(DEFINITIONS)) {
    if (definition.aliases.some((alias) => text.includes(alias))) return definition
  }
  return null
}

// Only treat a term as a "what is…" lookup when they are actually asking about the term.
function isDefinitionQuestion(text) {
  const cues = ['what is', 'what are', 'whats', 'what s', 'meaning', 'define', 'explain', 'tell me about', 'difference between', 'what does']
  if (cues.some((cue) => text.includes(cue))) return true
  return text.split(' ').filter(Boolean).length <= 2
}

function findPlatform(text) {
  const padded = ` ${text} `
  const match = PLATFORMS.find((entry) => entry.words.some((word) => padded.includes(word)))
  return match ? PLATFORM_STEPS[match.key] : null
}

function compose(ctx, spec) {
  const parts = []

  if (spec.opener && OPENERS[spec.opener]) {
    parts.push(pick(ctx, OPENERS[spec.opener], spec.opener))
  }

  for (const line of spec.body || []) parts.push(line)

  const steps = (spec.steps || []).filter((step) => !ctx.previous.includes(normalise(step).slice(0, 34)))
  if (steps.length) {
    parts.push(steps.map((step, index) => `${index + 1}. ${step}`).join('\n'))
  } else if ((spec.steps || []).length) {
    parts.push('You already have the main steps — the next thing is to actually send the report, or say it out loud to an adult.')
  }

  if (spec.ask && !ctx.previous.includes(normalise(spec.ask).slice(0, 26))) parts.push(spec.ask)

  return { reply: parts.filter(Boolean).join('\n'), intent: spec.intent || 'guide' }
}

function platformReport(ctx) {
  const platform = findPlatform(ctx.all)
  if (!platform) return null
  return {
    opener: 'practical',
    body: [`Here are the reporting steps for ${platform.name}.`, 'Reporting is usually private — the other person is not told it was you.'],
    steps: platform.steps,
    ask: 'Would you like the blocking steps as well?',
    intent: 'report',
  }
}

function followUp(ctx) {
  const previousIntent =
    ctx.previousIntent ||
    (ctx.previous.includes('report')
      ? 'report'
      : ctx.previous.includes('block')
        ? 'block'
        : ctx.previous.includes('adult')
          ? 'trusted-adult'
          : null)
  if (!previousIntent) return null

  if (previousIntent === 'report' || previousIntent === 'bullying' || previousIntent === 'danger') {
    const platform = platformReport(ctx)
    if (platform) return { ...platform, intent: 'report' }
    if (previousIntent !== 'report') {
      return {
        opener: 'practical',
        body: ['The report button is usually easy to find once you know where to look.'],
        steps: [
          'Open the message or profile and look for the three-dot menu, or press and hold the message.',
          'Choose Report, then pick bullying, harassment or impersonation.',
          'Block the account from the same menu so they cannot keep contacting you.',
          'Tell an adult as well — a report to the app and a report to a person work best together.',
        ],
        ask: 'Which app is it on? I can give you the exact steps.',
        intent: 'report',
      }
    }
    return {
      opener: 'practical',
      body: ['If you cannot find the report button, this usually works:'],
      steps: [
        'Open the message or profile and look for three dots, or press and hold the message.',
        'Choose Report, then pick bullying, harassment or impersonation.',
        'Block the account from the same menu.',
      ],
      ask: 'Which app is it on? I can narrow it down.',
      intent: 'report',
    }
  }

  if (previousIntent === 'block') {
    return {
      opener: 'practical',
      body: ['Blocking usually lives in the same menu as reporting, on the person’s profile.'],
      steps: [
        'Open their profile and tap the three dots.',
        'Choose Block, not just Mute.',
        'If a new account appears, report that one too — it is against the rules to keep coming back.',
      ],
      ask: 'Is there anything else that would help, like what to say to an adult?',
      intent: 'block',
    }
  }

  if (previousIntent === 'trusted-adult') {
    return {
      opener: 'reassure',
      body: ['You can keep it short. A first sentence is enough to start the conversation.'],
      steps: [
        'Say: “Something is happening online and I need help with it.”',
        'Show the screenshots rather than explaining from the beginning.',
        'Ask them not to post about it or contact the person without telling you.',
        'If they brush it off, tell another adult. That is allowed.',
      ],
      ask: 'Do you want to think through what you would say first?',
      intent: 'trusted-adult',
    }
  }

  if (previousIntent === 'evidence') {
    return {
      opener: 'practical',
      body: ['A screenshot is most useful when it shows who, what and when.'],
      steps: [
        'Include the username and profile photo in the shot.',
        'Catch the date or time in the same screenshot.',
        'Keep the original chat as well.',
        'Back the images up somewhere private, not in a shared folder.',
      ],
      intent: 'evidence',
    }
  }

  return null
}

function greeting(ctx) {
  const first = ctx.turn <= 1
  return {
    reply: pick(
      ctx,
      first
        ? [
            'Hi! I’m the ScreenSide guide. What’s on your mind — something happening online, or a question about staying safe?',
            'Hey there. I’m here to help with anything online: mean messages, weird accounts, privacy, or just a question. What’s up?',
            'Hello! Ask me anything about online safety, or tell me what’s going on and we’ll work it out together.',
          ]
        : [
            'Hey again — what else is on your mind?',
            'I’m still here. What would you like to look at next?',
            'Hi again! What else can I help with?',
          ],
      'greeting'
    ),
    intent: 'greeting',
  }
}

function unknown(ctx) {
  return {
    reply: pick(
      ctx,
      [
        'I’m not sure about that one, and I’d rather say so than guess. I’m best with online safety — bullying, reporting, privacy, passwords, scams, or a situation that is happening to you right now.',
        'That is outside what I know well enough to answer safely. I can help with things like hurtful messages, fake accounts, privacy settings, or how to report something — is any of that what you need?',
        'I don’t want to make something up, so I’ll be honest: I don’t know that one. Ask me about online safety and I can probably help, or a trusted adult or teacher is a better bet for this.',
      ],
      'unknown'
    ),
    intent: 'unknown',
  }
}

export function guideReply(messages) {
  const ctx = analyse(messages)

  if (!ctx.last) return greeting(ctx)

  // Safety first, before anything else, including short replies.
  const urgent = TOPICS.find(
    (entry) => (entry.id === 'selfharm' || entry.id === 'danger' || entry.id === 'blackmail') && hasAny(ctx.last, entry.words)
  )
  if (urgent) {
    return compose(ctx, { ...urgent.build(ctx), intent: urgent.id })
  }

  const wordCount = ctx.last.split(' ').filter(Boolean).length

  // They answered a previous question by naming an app: give that app's steps.
  if (wordCount <= 5) {
    const platform = findPlatform(` ${ctx.last} `)
    const aboutReporting =
      ['report', 'bullying', 'danger', 'block', 'hacked'].includes(ctx.previousIntent) ||
      ctx.previous.includes('report') ||
      ctx.previous.includes('block')
    if (platform && (aboutReporting || wordCount <= 2)) {
      return compose(ctx, {
        opener: 'practical',
        body: [`Here are the steps for ${platform.name}.`],
        steps: platform.steps,
        ask: 'Do you want the blocking steps as well?',
        intent: 'report',
      })
    }
  }

  // Short follow-up like "yes", "no", "idk" — use what was asked last turn.
  if (wordCount <= 3) {
    if (hasWord(ctx.last, IDK)) {
      return {
        reply: pick(
          ctx,
          [
            'That’s fine — start wherever you can. Is it something that already happened, or something you are worried might happen?',
            'No pressure to know. Is this about messages, an account, photos, or something else?',
          ],
          'idk'
        ),
        intent: 'clarify',
      }
    }
    if (hasWord(ctx.last, YES)) {
      const next = followUp(ctx)
      if (next) return compose(ctx, next)
      return {
        reply: pick(
          ctx,
          [
            'Okay. Tell me a bit more whenever you are ready — what happened, and who is involved?',
            'Got it. Is there anything you want to change, or another question about it?',
            'Alright. If it helps, we can work out what to say to an adult about it.',
          ],
          'affirm'
        ),
        intent: 'acknowledge',
      }
    }
    if (hasWord(ctx.last, NO)) {
      return {
        reply: pick(
          ctx,
          [
            'That’s okay. We don’t have to do anything this second. If you want, I can just explain what the options are, or we can stop here.',
            'No problem. Nothing has to happen right now. If it helps, I can walk you through what would make things safer for later.',
          ],
          'decline'
        ),
        intent: 'decline',
      }
    }
  }

  if (wordCount <= 4 && hasWord(ctx.last, ['hi', 'hello', 'hey', 'hiya', 'yo', 'namaste', 'hii'])) {
    return greeting(ctx)
  }

  if (hasWord(ctx.last, ['thank', 'thanks', 'thankyou', 'ty', 'bye', 'goodbye'])) {
    return {
      reply: pick(
        ctx,
        [
          'Anytime. If something else comes up, I’m here — and a trusted adult is always the stronger option for anything serious.',
          'You’re welcome. Take care of yourself, and remember you don’t have to deal with this alone.',
          'Glad I could help. Come back if you need anything else.',
        ],
        'closing'
      ),
      intent: 'closing',
    }
  }

  if (hasAny(ctx.last, ['how are you', 'how r u', 'hows it going'])) {
    return {
      reply: 'I’m doing well, thanks for asking. More importantly — how are you doing? Is something happening online, or do you have a question?',
      intent: 'smalltalk',
    }
  }

  // A question about a specific term gets that term's explanation.
  const definition = isDefinitionQuestion(ctx.last) ? findDefinition(ctx.last) : null
  if (definition) {
    return compose(ctx, {
      opener: 'neutral',
      body: [definition.text],
      ask: pick(ctx, [
        'Would you like to know what to do if it happens to you?',
        'Do you want the practical steps as well?',
        'Has something like this happened to you?',
        '',
      ], `def-${definition.label}`),
      intent: 'definition',
    })
  }

  const topic = TOPICS.find((entry) => hasAny(ctx.last, entry.words))

  if (topic) {
    if (topic.id === 'report') {
      const platform = platformReport(ctx)
      if (platform) return compose(ctx, platform)
    }
    return compose(ctx, { ...topic.build(ctx), intent: topic.id })
  }

  // No topic matched the new message: say so instead of recycling an older topic.
  return unknown(ctx)
}
