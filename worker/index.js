// ScreenSide Worker: JSON API plus the built single-page app.
import { guideReply } from './guide.js'
import { generateAiReply, aiConfigured, aiModel } from './ai.js'
import { json, fail, readJson, sha256Hex, clientIp } from './lib.js'
import { ensureSchema, getContent, recordChatUsage, sessionSecret } from './db.js'
import { handleAdmin } from './admin.js'

const DAILY_CHAT_LIMIT = 80

async function handleChat(request, env) {
  if (request.method !== 'POST') return fail('Method not allowed.', 405)

  let body
  try {
    body = await readJson(request, 30000)
  } catch (error) {
    return fail(error.message, 400)
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-14) : []
  const messages = incoming
    .map((message) => ({
      role: message && message.role === 'assistant' ? 'assistant' : 'user',
      content: typeof (message && message.content) === 'string' ? message.content.slice(0, 1200) : '',
    }))
    .filter((message) => message.content.trim().length > 0)

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return fail('Please type a message first.', 400)
  }

  if (aiConfigured(env)) {
    try {
      const secret = await sessionSecret(env)
      const ipHash = await sha256Hex(`${clientIp(request)}|${secret}`)
      const used = await recordChatUsage(env, ipHash)

      if (used <= DAILY_CHAT_LIMIT) {
        const answer = await generateAiReply(env, messages)
        if (answer) return json(answer)
      }
    } catch (error) {
      console.error('AI path failed, using built-in guidance:', error && error.message)
    }
  }

  return json(guideReply(messages))
}

async function route(request, env, url) {
  if (url.pathname === '/api/health') {
    return json({
      ok: true,
      aiEnabled: aiConfigured(env),
      model: aiConfigured(env) ? aiModel(env) : 'built-in-guide',
    })
  }

  if (url.pathname === '/api/content') {
    if (request.method !== 'GET') return fail('Method not allowed.', 405)
    return json({ content: await getContent(env) })
  }

  if (url.pathname === '/api/chat') {
    return handleChat(request, env)
  }

  if (url.pathname.startsWith('/api/admin/')) {
    return handleAdmin(request, env, url)
  }

  return fail('Not found.', 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      try {
        await ensureSchema(env)
        return await route(request, env, url)
      } catch (error) {
        console.error('API error:', error && error.stack ? error.stack : error)
        return fail('Something went wrong. Please try again in a moment.', 500)
      }
    }

    // Static assets, with a single-page-app fallback for deep links like /learn/what-is-cyberbullying.
    const response = await env.ASSETS.fetch(request)
    if (response.status === 404 && (request.method === 'GET' || request.method === 'HEAD')) {
      const indexUrl = new URL('/', url)
      return env.ASSETS.fetch(new Request(indexUrl.toString(), { method: 'GET', headers: request.headers }))
    }
    return response
  },
}
