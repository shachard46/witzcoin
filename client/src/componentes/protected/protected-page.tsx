import { useAuth } from '../auth/auth-provider'
import NotFoundPage from '../not-found-page'
import { ProtectedPageParams } from './model'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  level,
  className,
  children,
}) => {
  const { isAutonticated, user, scope, isLoading } = useAuth()
  if (isLoading) {
    return null
  }
  if (isAutonticated) {
    if (level < scope) {
      return null
    }
    return <div className={className ? className : ''}>{children}</div>
  }
  return <NotFoundPage />
}
