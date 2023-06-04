import { useEffect } from 'react'
import { useAuth } from '../auth/auth-provider'
import { ProtectedPageParams } from './model'
import NotFoundPage from '../not-found-page'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  level,
  children,
}) => {
  const { isAutonticated, user, scope } = useAuth()
  if (isAutonticated) {
    if (level < scope) {
      return <NotFoundPage/>
    }
    return <div>{children}</div>
  }
  return <NotFoundPage/>
}
