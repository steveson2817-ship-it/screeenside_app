import { useState } from 'react'
import Icon from '../Icon.jsx'
import { Field } from './Forms.jsx'
import { adminChangePassword } from '../../lib/api.js'

export default function AccountPanel({ onLogout, onSessionEnded }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (next !== confirm) {
      setError('The new passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await adminChangePassword(current, next)
      setMessage('Password updated. Any other signed-in devices have been signed out.')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      if (err.status === 401 && onSessionEnded) {
        onSessionEnded(err.message)
        return
      }
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="panel-head">
        <h2>Admin account</h2>
        <p className="muted">
          Only this account can change the site. Students can view and use ScreenSide, but cannot edit anything.
        </p>
      </div>

      <form className="form-narrow" onSubmit={submit}>
        <Field label="Current password">
          <input
            className="input"
            type="password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            autoComplete="current-password"
            required
          />
        </Field>
        <Field label="New password" hint="At least 10 characters.">
          <input
            className="input"
            type="password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            autoComplete="new-password"
            minLength={10}
            required
          />
        </Field>
        <Field label="Confirm new password">
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

        {error ? (
          <p className="alert err">
            <Icon name="alert" size={15} /> {error}
          </p>
        ) : null}
        {message ? (
          <p className="alert ok">
            <Icon name="check" size={15} /> {message}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          <Icon name="key" size={17} /> {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="account-footer">
        <button type="button" className="btn btn-secondary" onClick={onLogout}>
          <Icon name="logout" size={17} /> Sign out
        </button>
      </div>
    </div>
  )
}
