import { useCallback, useEffect, useState } from 'react'
import { client, logout } from '../../../lib/api/client'
import type { CurrentUser } from '../types'

export function useSession(enabled = true) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let active = true
    void client<CurrentUser>('me')
      .then((currentUser) => {
        if (!active) return
        setUser(currentUser)
        setConnectionError(null)
      })
      .catch((error: unknown) => {
        if (!active) return
        const message = error instanceof Error ? error.message : 'Could not connect to the API.'
        if (message.startsWith('Please sign in')) {
          setConnectionError(null)
        } else {
          setConnectionError(message)
        }
        setUser(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [enabled])

  const signOut = useCallback(async () => {
    await logout()
  }, [])

  return { user, loading, connectionError, signOut }
}
