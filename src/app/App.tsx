import type { ReactNode } from 'react'
import AppShell from '../components/layout/AppShell'
import { useSession } from '../features/auth/hooks/useSession'
import RegisterPage from '../features/auth/pages/RegisterPage'
import SessionPage from '../features/auth/pages/SessionPage'
import SignedOutPage from '../features/auth/pages/SignedOutPage'
import SignInPage from '../features/auth/pages/SignInPage'

function App() {
  const path = window.location.pathname
  const justSignedOut = sessionStorage.getItem('phanith.signedOut') === 'true'
  const isRegistrationPage = path === '/register'
  const isSignedOutPage = justSignedOut || path === '/signed-out'
  const { user, loading, connectionError, signOut } = useSession(!isRegistrationPage && !isSignedOutPage)

  let page: ReactNode
  if (isSignedOutPage) {
    page = <SignedOutPage />
  } else if (isRegistrationPage) {
    page = <RegisterPage />
  } else if (loading) {
    page = <div className="loading-card" role="status">Checking your session…</div>
  } else if (user) {
    page = <SessionPage user={user} onSignOut={signOut} />
  } else {
    page = <SignInPage connectionError={connectionError} />
  }

  return <AppShell sessionActive={user !== null}>{page}</AppShell>
}

export default App
