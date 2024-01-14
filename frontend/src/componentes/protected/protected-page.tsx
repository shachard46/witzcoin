import { useAuth } from '../auth/auth-provider'
import { Role } from '../auth/models'
// import NotFoundPage from '../not-found-page'
import { ProtectedPageParams } from './model'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  reqScope,
  className,
  children,
}) => {
  const { isAutonticated, user, isLoading } = useAuth()
  if (isLoading) {
    return null
  }
  if (isAutonticated) {
    if (
      (reqScope === Role.ADMIN && user?.role !== Role.ADMIN) ||
      reqScope == Role.OUT
    ) {
      return null
    }
    return <div className={className ? className : ''}>{children}</div>
  }
  if (!isAutonticated && reqScope == Role.OUT)
    return <div className={className ? className : ''}>{children}</div>
  return null //<NotFoundPage />
}
