import { useEffect } from 'react'

type SignInPageProps = {
  connectionError: string | null
}

function SignInPage({ connectionError }: SignInPageProps) {
  useEffect(() => {
    if (!connectionError) {
      window.location.replace('/oauth2/authorization/keycloak-learning')
    }
  }, [connectionError])

  return (
    <section className="hero auth-hero">
      <div className="eyebrow"><span /> YOUR LEARNING SPACE</div>
      <h1>Secure <span className="accent">sign in.</span></h1>
      <p className="subtitle">
        {connectionError
          ? 'We could not connect to the sign-in service.'
          : 'Opening the secure Keycloak sign-in page…'}
      </p>
      {connectionError ? (
        <div className="result error" role="alert"><pre>{connectionError}</pre></div>
      ) : (
        <p className="auth-switch">If you are not redirected, <a href="/oauth2/authorization/keycloak-learning">continue to sign in</a>.</p>
      )}
    </section>
  )
}

export default SignInPage
