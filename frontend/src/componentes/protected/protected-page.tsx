import { useAuth } from '../auth/auth-provider'
import { Role } from '../auth/models'
import NotFoundPage from '../not-found-page'
import { ProtectedPageParams } from './model'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  reqScope,
  className,
  children,
}) => {
  const { isAutonticated, scope, isLoading } = useAuth()
  if (isLoading) {
    return null
  }
  if (isAutonticated) {
    if (reqScope === Role.ADMIN && scope !== Role.ADMIN) {
      return null
    }
    return <div className={className ? className : ''}>{children}</div>
  }
  return <NotFoundPage />
}
