const apiBase = '/api/v1/auth'

type CsrfTokenResponse = {
  headerName: string
  parameterName?: string
  token: string
}

let csrfToken: CsrfTokenResponse | undefined

async function getCsrfToken() {
  if (!csrfToken) {
    const response = await fetch(`${apiBase}/csrf`, {
      credentials: 'same-origin',
    })
    if (!response.ok) throw new Error('Could not prepare a secure request.')
    csrfToken = (await response.json()) as CsrfTokenResponse
  }
  return csrfToken
}

export async function client<T = string>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    const token = await getCsrfToken()
    headers.set(token.headerName, token.token)
  }

  const response = await fetch(`${apiBase}/${path}`, {
    ...init,
    method,
    headers,
    credentials: 'same-origin',
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('Please sign in to continue.')
    if (response.status === 403) throw new Error('Your account does not have access to this route.')
    const body = await response.text()
    let message = body
    try {
      const payload: unknown = JSON.parse(body)
      if (payload && typeof payload === 'object') {
        const detail = payload as { detail?: unknown; message?: unknown; title?: unknown; fieldErrors?: unknown }
        const candidate = [detail.detail, detail.message, detail.title].find((value) => typeof value === 'string')
        if (typeof candidate === 'string') message = candidate
        if (detail.fieldErrors && typeof detail.fieldErrors === 'object') {
          const fields = Object.entries(detail.fieldErrors).map(([field, issue]) => `${field}: ${String(issue)}`)
          if (fields.length) message = `${message === body ? '' : `${message}. `}${fields.join(' ' )}`
        }
      }
    } catch {
      // Keep plain response text when the backend does not return JSON.
    }
    throw new Error(message || `Request failed (${response.status}).`)
  }
  const contentType = response.headers.get('content-type') ?? ''
  return (contentType.includes('application/json')
    ? response.json()
    : response.text()) as Promise<T>
}

export async function logout() {
  const token = await getCsrfToken()
  sessionStorage.setItem('phanith.signedOut', 'true')
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = '/logout'
  const csrfInput = document.createElement('input')
  csrfInput.type = 'hidden'
  csrfInput.name = token.parameterName ?? '_csrf'
  csrfInput.value = token.token
  form.append(csrfInput)
  document.body.append(form)
  csrfToken = undefined
  form.submit()
}
