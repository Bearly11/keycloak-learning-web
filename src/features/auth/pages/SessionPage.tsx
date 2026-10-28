import { useState } from 'react'
import { client } from '../../../lib/api/client'
import type { CurrentUser } from '../types'

type Result = { label: string; value: string; tone: 'success' | 'error' }
type Route = 'public' | 'user' | 'admin'

type SessionPageProps = {
  user: CurrentUser
  onSignOut: () => Promise<void>
}

function SessionPage({ user, onSignOut }: SessionPageProps) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function checkRoute(route: Route) {
    setBusy(true)
    setResult(null)
    try {
      const value = await client(route)
      setResult({ label: `${route} route`, value, tone: 'success' })
    } catch (error) {
      setResult({
        label: `${route} route`,
        value: error instanceof Error ? error.message : 'Request failed.',
        tone: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    setBusy(true)
    try {
      await onSignOut()
      setResult({ label: 'Signed out', value: 'Your session has ended.', tone: 'success' })
    } catch (error) {
      setResult({
        label: 'Sign out failed',
        value: error instanceof Error ? error.message : 'Please try again.',
        tone: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow"><span /> SPRING BOOT + REACT</div>
        <h1>Good to see you.</h1>
        <p className="subtitle">Your Keycloak session is connected to the learning API.</p>
      </section>

      <section className="profile-card">
        <div className="avatar">{(user.username ?? user.email ?? 'U').slice(0, 1).toUpperCase()}</div>
        <div className="profile-copy">
          <span className="label">YOUR PROFILE · LOADED FROM /ME</span>
          <h2>{user.username ?? 'Keycloak user'}</h2>
          <p>{user.email ?? user.id}</p>
        </div>
        <button className="button secondary" onClick={handleSignOut} disabled={busy}>
          Sign out <span>↗</span>
        </button>
      </section>

      <section className="routes-section">
        <div className="section-heading">
          <div><span className="label">API EXPLORER</span><h2>Try a route</h2></div>
          <span className="api-tag">/api/v1/auth</span>
        </div>
        <div className="route-grid">
          {(['public', 'user', 'admin'] as const).map((route) => (
            <button className="route-card" key={route} onClick={() => void checkRoute(route)} disabled={busy}>
              <span className="route-method">GET</span>
              <code>/{route}</code>
              <span className="route-arrow">↗</span>
              <small>{route === 'public' ? 'Open access' : `${route.toUpperCase()} role required`}</small>
            </button>
          ))}
        </div>
        {result && (
          <div className={`result ${result.tone}`} role="status">
            <div className="result-heading">
              <strong>{result.label}</strong>
              <button onClick={() => setResult(null)} aria-label="Dismiss result">×</button>
            </div>
            <pre>{result.value}</pre>
          </div>
        )}
      </section>
    </>
  )
}

export default SessionPage
