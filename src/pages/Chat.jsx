import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { sendChatMessage } from '../lib/api.js'

// Chat is intentionally kept in component state only — never localStorage or a server history.
// Closing or reloading the site therefore always starts a completely fresh conversation.
const SUGGESTIONS = [
  'Someone keeps posting mean comments about me',
  'How do I report an account on Instagram?',
  'Someone is threatening to share my photos',
  'What is doxxing?',
  'I think my account was hacked',
  'How do I support a friend who is being bullied?',
]

let messageId = 0
const nextId = () => {
  messageId += 1
  return `message-${messageId}`
}

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const node = bodyRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, pending])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  async function send(text) {
    const cleaned = String(text || '').trim().slice(0, 900)
    if (!cleaned || pending) return

    const userMessage = { id: nextId(), role: 'user', content: cleaned }
    const history = [...messages, userMessage]
    setMessages(history)
    setInput('')
    setPending(true)

    try {
      const data = await sendChatMessage(history.map(({ role, content }) => ({ role, content })))
      setMessages((current) => [
        ...current,
        { id: nextId(), role: 'assistant', content: data.reply, source: data.source },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: 'assistant',
          content:
            'Sorry — I could not reach the server just now. Please try again in a moment. If something is happening right now, tell a trusted adult and call 112 or 100 if you are in danger.',
        },
      ])
    } finally {
      setPending(false)
    }
  }

  const started = messages.length > 0

  return (
    <div className="page chat-page">
      <div className="container section-tight">
        <div className="chat-shell">
          <header className="chat-header">
            <div className="chat-identity">
              <span className="chat-avatar">
                <Icon name="shield" size={22} />
              </span>
              <div>
                <strong>ScreenSide Guide</strong>
                <span className="chat-status">
                  <span className="dot" /> Ready to help · general guidance only
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowPrivacy((value) => !value)}
                aria-expanded={showPrivacy}
              >
                <Icon name="lock" size={15} /> Privacy
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setMessages([])
                  setInput('')
                  setPending(false)
                  if (inputRef.current) inputRef.current.focus()
                }}
                disabled={!started && !pending}
              >
                <Icon name="reset" size={15} /> New chat
              </button>
            </div>
          </header>

          {showPrivacy ? (
            <div className="chat-privacy">
              <h3>
                <Icon name="lock" size={16} /> How your chat is handled
              </h3>
              <ul>
                <li>
                  Your messages are used to write a reply. ScreenSide does not save your conversation in its
                  database, and it is not shown to other students.
                </li>
                <li>
                  The chat lives only in this page. Reloading or closing the site starts an empty chat — it is
                  never restored.
                </li>
                <li>
                  If the site owner has switched on AI replies, your message text is sent to the AI provider to
                  write the response.
                </li>
                <li>
                  A one-way counter is kept to stop abuse. Do not type your name, school, address, phone number or
                  passwords.
                </li>
                <li>
                  This is not a counselling or emergency service, and it is not anonymous. For real danger, tell a
                  trusted adult and call 112 or 100.
                </li>
              </ul>
              <Link to="/privacy" className="text-link">
                Read the full privacy notice
                <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          ) : null}

          <div className="chat-body" ref={bodyRef} aria-live="polite">
            {!started ? (
              <div className="chat-empty">
                <span className="chat-empty-icon">
                  <Icon name="chat" size={30} />
                </span>
                <h1>Hi, I’m the ScreenSide guide</h1>
                <p>
                  Ask me about anything that happens online — mean messages, fake accounts, rumours, privacy, or
                  how to report something. I’ll keep it short and practical.
                </p>
                <div className="chat-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" className="chip-btn" onClick={() => send(suggestion)}>
                      {suggestion}
                    </button>
                  ))}
                </div>
                <p className="chat-empty-note">
                  <Icon name="alert" size={14} /> You don’t have to share anything personal. This chat starts fresh
                  every time you open the site.
                </p>
              </div>
            ) : (
              <div className="chat-thread">
                {messages.map((message) => (
                  <div key={message.id} className={`msg msg-${message.role}`}>
                    {message.role === 'assistant' ? (
                      <span className="msg-avatar">
                        <Icon name="shield" size={16} />
                      </span>
                    ) : null}
                    <div className="msg-bubble">
                      {message.content.split('\n').map((line, lineIndex) =>
                        line ? <p key={lineIndex}>{line}</p> : null
                      )}
                    </div>
                  </div>
                ))}
                {pending ? (
                  <div className="msg msg-assistant">
                    <span className="msg-avatar">
                      <Icon name="shield" size={16} />
                    </span>
                    <div className="msg-bubble typing" aria-label="The guide is typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <form
            className="chat-composer"
            onSubmit={(event) => {
              event.preventDefault()
              send(input)
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  send(input)
                }
              }}
              placeholder="Type what’s happening, or ask a question…"
              maxLength={900}
              rows={1}
              aria-label="Message the ScreenSide guide"
            />
            <button type="submit" className="chat-send" disabled={!input.trim() || pending} aria-label="Send message">
              <Icon name="send" size={19} />
            </button>
          </form>

          <p className="chat-foot">
            <Icon name="alert" size={14} /> General guidance, not counselling or emergency help. If you are in
            danger, call <a href="tel:112">112</a> and tell a trusted adult. <Link to="/help">More help options</Link>
          </p>
        </div>

        <div className="chat-side">
          <div className="side-card">
            <h2>Good to know</h2>
            <ul>
              <li>This guide does not judge you or blame you.</li>
              <li>It will never ask for your password or personal details.</li>
              <li>It will always point you towards a real adult for serious problems.</li>
            </ul>
          </div>
          <div className="side-card side-card-warm">
            <h2>Need a real person?</h2>
            <p>
              Helplines and the official reporting portal are in the Help Centre — including police, emergency and
              cyber-fraud numbers.
            </p>
            <Link to="/help" className="btn btn-secondary btn-sm">
              Open Help Centre
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
