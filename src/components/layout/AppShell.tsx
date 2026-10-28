import type { ReactNode } from 'react'

type AppShellProps = {
  sessionActive: boolean
  children: ReactNode
}

function AppShell({ sessionActive, children }: AppShellProps) {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Keycloak Learning home">
          <span className="brand-mark">K</span>
          <span>Keycloak <b>Learning</b></span>
        </a>
        <span className={`connection ${sessionActive ? 'online' : ''}`}>
          <span className="connection-dot" />
          {sessionActive ? 'Session active' : 'Not signed in'}
        </span>
      </header>

      {children}

      <footer>
        <span>KEYCLOAK LEARNING</span>
        <span>Authentication by Keycloak · API by Spring Boot</span>
      </footer>
    </main>
  )
}

export default AppShell
