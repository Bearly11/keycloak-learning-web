import { useEffect } from 'react'
import { buttonVariants } from '../../../components/ui/button'

function SignedOutPage() {
  useEffect(() => {
    sessionStorage.removeItem('phanith.signedOut')
  }, [])

  return (
    <section className="hero auth-hero">
      <div className="eyebrow"><span /> SESSION ENDED</div>
      <h1>You are <span className="accent">signed out.</span></h1>
      <p className="subtitle">Your Keycloak session has ended. Sign in again whenever you are ready.</p>
      <p className="mt-6">
        <a className={buttonVariants()} href="/oauth2/authorization/keycloak-learning">Sign in</a>
      </p>
    </section>
  )
}

export default SignedOutPage
