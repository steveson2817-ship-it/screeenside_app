import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useContent } from '../components/ContentContext.jsx'
import SiteEditor from '../components/admin/SiteEditor.jsx'
import LessonsEditor from '../components/admin/LessonsEditor.jsx'
import { HelpEditor, QuestEditor, TipsEditor } from '../components/admin/ContentEditors.jsx'
import AccountPanel from '../components/admin/AccountPanel.jsx'
import { adminLogin, adminLogout, adminSaveContent, adminSession, adminSetup, fetchContent } from '../lib/api.js'
import { Field } from '../components/admin/Forms.jsx'

const TABS = [
  { id: 'site', label: 'Website text' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'tips', label: 'Safety tips' },
  { id: 'quest', label: 'CyberQuest' },
  { id: 'help', label: 'Help Centre' },
  { id: 'account', label: 'Account' },
]

function AuthPanel({ configured, setupAvailable, notice, onSignedIn }) {
  const [mode, setMode] = useState(configured ? 'login' : 'setup')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')

    if (mode === 'setup' && password !== confirm) {
      setError('The passwords do not match.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'setup') {
        await adminSetup(token, password)
      } else {
        await adminLogin(password)
      }
      onSignedIn()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-auth">
      <div className="admin-auth-card">
        <span className="admin-lock">
          <Icon name="lock" size={26} />
        </span>
        <h1>{mode === 'setup' ? 'Set up admin access' : 'Admin sign in'}</h1>
        <p className="muted">
          {mode === 'setup'
            ? 'This page is only for the site owner. Enter the one-time setup code and choose a password. Students never see this page.'
            : 'Only the site owner can manage ScreenSide content. Students can use every page without signing in.'}
        </p>

        {notice ? (
          <p className="alert err">
            <Icon name="alert" size={15} /> {notice}
          </p>
        ) : null}

        {mode === 'setup' && !setupAvailable ? (
          <p className="alert err">
            <Icon name="alert" size={15} /> Setup is switched off until the site owner adds the SETUP_TOKEN secret to
            the server.
          </p>
        ) : null}

        {mode === 'setup' ? (
          <ol className="setup-steps">
            <li>Enter the one-time setup code from the project owner.</li>
            <li>Choose a strong password with at least 10 characters.</li>
            <li>After this, sign in with that password to edit the site.</li>
          </ol>
        ) : null}

        <form onSubmit={submit}>
          {mode === 'setup' ? (
            <Field label="One-time setup code" hint="Provided by the site creator. Not a student login.">
              <input
                className="input"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                autoComplete="one-time-code"
                required
              />
            </Field>
          ) : null}

          <Field label={mode === 'setup' ? 'Choose a password' : 'Password'} hint={mode === 'setup' ? 'At least 10 characters.' : undefined}>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'setup' ? 'new-password' : 'current-password'}
              minLength={mode === 'setup' ? 10 : undefined}
              required
            />
          </Field>

          {mode === 'setup' ? (
            <Field label="Confirm password">
              <input
                className="input"
                type="password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                required
              />
            </Field>
          ) : null}

          {error ? (
            <p className="alert err">
              <Icon name="alert" size={15} /> {error}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            <Icon name="lock" size={17} />
            {busy ? 'Please wait…' : mode === 'setup' ? 'Create admin account' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          className="text-link center"
          onClick={() => {
            setMode(mode === 'setup' ? 'login' : 'setup')
            setError('')
          }}
        >
          {mode === 'setup' ? 'Already set up? Sign in instead' : 'Need to set up admin access?'}
        </button>

        <Link to="/" className="text-link center">
          Back to ScreenSide
        </Link>
      </div>
    </div>
  )
}

function Dashboard({ onSignedOut, onSessionEnded }) {
  const { applyContent } = useContent()
  const [tab, setTab] = useState('site')
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchContent()
      .then(setContent)
      .catch((err) => setError(err.message))
  }, [])

  const save = async (key, data) => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await adminSaveContent(key, data)
      setContent(response.content)
      applyContent(response.content)
      setMessage('Saved. The live site is updated.')
      return true
    } catch (err) {
      if (err.status === 401) {
        onSessionEnded(err.message)
        return false
      }
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const changeTab = (next) => {
    setTab(next)
    setMessage('')
    setError('')
  }

  if (!content) {
    return (
      <div className="container section">
        <p className="muted">{error ? error : 'Loading the content manager…'}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container section-tight">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Admin only</span>
            <h1>Manage ScreenSide</h1>
            <p className="muted">
              You are signed in as the site owner. Every change is checked again on the server, so students cannot
              edit content even if they find this page.
            </p>
          </div>
          <Link to="/" className="btn btn-secondary btn-sm">
            View site
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Content sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`admin-tab${tab === item.id ? ' active' : ''}`}
              onClick={() => changeTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'site' ? (
          <SiteEditor
            key="site"
            value={content.site}
            onSave={save}
            saving={saving}
            message={message}
            error={error}
          />
        ) : null}
        {tab === 'lessons' ? (
          <LessonsEditor
            key="lessons"
            value={content.lessons}
            onSave={save}
            saving={saving}
            message={message}
            error={error}
          />
        ) : null}
        {tab === 'tips' ? (
          <TipsEditor key="tips" value={content.tips} onSave={save} saving={saving} message={message} error={error} />
        ) : null}
        {tab === 'quest' ? (
          <QuestEditor key="quest" value={content.quest} onSave={save} saving={saving} message={message} error={error} />
        ) : null}
        {tab === 'help' ? (
          <HelpEditor key="help" value={content.help} onSave={save} saving={saving} message={message} error={error} />
        ) : null}
        {tab === 'account' ? <AccountPanel onLogout={onSignedOut} onSessionEnded={onSessionEnded} /> : null}
      </div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // A failed status check is shown as an error with a retry, never as the first-time setup form.
  const check = () => {
    setError('')
    adminSession()
      .then((next) => {
        setSession(next)
        if (next.authenticated) setNotice('')
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    check()
  }, [])

  async function signOut() {
    try {
      await adminLogout()
    } finally {
      setSession({ configured: true, authenticated: false })
    }
  }

  const sessionEnded = (message) => {
    setNotice(message || 'Your session has ended. Please sign in again.')
    setSession((current) => ({ ...(current || {}), configured: true, authenticated: false }))
  }

  if (!session) {
    return (
      <div className="container section">
        {error ? (
          <div className="empty-card">
            <p className="muted">Could not check admin access: {error}</p>
            <button type="button" className="btn btn-primary" onClick={check}>
              Try again
            </button>
          </div>
        ) : (
          <p className="muted">Checking admin access…</p>
        )}
      </div>
    )
  }

  if (!session.authenticated) {
    return (
      <div className="page">
        <AuthPanel
          configured={session.configured}
          setupAvailable={session.setupAvailable !== false}
          notice={notice}
          onSignedIn={check}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <Dashboard onSignedOut={signOut} onSessionEnded={sessionEnded} />
    </div>
  )
}
