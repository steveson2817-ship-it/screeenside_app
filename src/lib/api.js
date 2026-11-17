async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: { 'content-type': 'application/json', accept: 'application/json', ...(options.headers || {}) },
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = (data && data.error) || 'Something went wrong. Please try again.'
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return data
}

export async function fetchContent() {
  const data = await request('/api/content')
  return data.content
}

export async function sendChatMessage(messages) {
  const payload = messages.slice(-12).map((message) => ({ role: message.role, content: message.content }))
  const data = await request('/api/chat', { method: 'POST', body: JSON.stringify({ messages: payload }) })
  return data
}

export function adminSession() {
  return request('/api/admin/session')
}

export function adminSetup(token, password) {
  return request('/api/admin/setup', { method: 'POST', body: JSON.stringify({ token, password }) })
}

export function adminLogin(password) {
  return request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
}

export function adminLogout() {
  return request('/api/admin/logout', { method: 'POST' })
}

export function adminSaveContent(key, data) {
  return request('/api/admin/content', { method: 'PUT', body: JSON.stringify({ key, data }) })
}

export function adminChangePassword(currentPassword, newPassword) {
  return request('/api/admin/password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
