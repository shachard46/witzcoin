import { Navigate } from 'react-router-dom'
import { useAuth } from './auth-hook'

/** Resolves `/` to login or create-transaction based on session. */
export function HomeRedirect() {
  const { isAutonticated, isLoading } = useAuth()
  if (isLoading) {
    return null
  }
  if (isAutonticated) {
    return <Navigate to='/p/transaction' replace />
  }
  return <Navigate to='/login' replace />
}
