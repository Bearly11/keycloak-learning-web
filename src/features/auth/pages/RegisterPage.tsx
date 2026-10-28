import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button, buttonVariants } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { client } from '../../../lib/api/client'

type Registration = {
  firstName: string
  lastName: string
  email: string
  password: string
}

function RegisterPage() {
  const [form, setForm] = useState<Registration>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState(false)

  function update(field: keyof Registration, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      await client('register', { method: 'POST', body: JSON.stringify(form) })
      setCreated(true)
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'We could not create your account. Please try signing in with Keycloak.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="hero auth-hero">
        <div className="eyebrow"><span /> CREATE YOUR ACCOUNT</div>
        <h1>Start <span className="accent">learning.</span></h1>
        <p className="subtitle">
          Create your account to get started. Your credentials are managed securely by Keycloak.
        </p>
      </section>

      <Card className="max-w-xl border-border bg-card shadow-sm">
        <CardContent className="p-6">
          {created ? (
            <div className="form-success" role="status">
              <h2 className="text-lg font-semibold">Account created</h2>
              <p className="my-2 mb-5 text-sm text-muted-foreground">
                You can now sign in with your new account.
              </p>
              <a className={buttonVariants()} href="/">
                Go to sign in <span aria-hidden="true" />
              </a>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={(event) => void submit(event)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  First name
                  <Input
                    autoComplete="given-name"
                    required
                    maxLength={50}
                    value={form.firstName}
                    onChange={(event) => update('firstName', event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Last name
                  <Input
                    autoComplete="family-name"
                    required
                    maxLength={50}
                    value={form.lastName}
                    onChange={(event) => update('lastName', event.target.value)}
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium">
                Email address
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={100}
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Password
                <div className="relative">
                  <Input
                    className="pr-10"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    value={form.password}
                    onChange={(event) => update('password', event.target.value)}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <small className="font-normal text-muted-foreground">Use at least 8 characters.</small>
              </label>

              {error && (
                <div
                  className="space-y-1 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                  role="alert"
                >
                  <strong>We could not create your account.</strong>
                  <p>{error}</p>
                  <p>
                    <a
                      className="font-medium underline underline-offset-4"
                      href="/oauth2/authorization/keycloak-learning"
                    >
                      Sign in with an existing account
                    </a>{' '}
                    or correct the details and try again.
                  </p>
                </div>
              )}

              <Button className="w-full" type="submit" disabled={busy}>
                {busy ? 'Creating account…' : 'Create account'} <span aria-hidden="true" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {!created && (
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a className="font-medium text-primary underline-offset-4 hover:underline" href="/">
            Sign in
          </a>
        </p>
      )}
    </>
  )
}

export default RegisterPage
