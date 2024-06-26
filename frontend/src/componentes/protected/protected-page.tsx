import { useAuth } from '../auth/auth-hook'
import { Role } from '../auth/models'
// import NotFoundPage from '../not-found-page'
import { ProtectedPageParams } from './model'
import { useLocation, useNavigate } from 'react-router-dom'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  reqScope,
  className,
  children,
}) => {
  const { isAutonticated, user, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
  if (reqScope == Role.OUT) {
    return <div className={className ? className : ''}>{children}</div>
  }
  // alert(location.pathname)
  // if (location.pathname !== '/login' && location.pathname !== '') {
  //   console.log('bnan', location.pathname, reqScope)
  //   navigate('/login')
  // }
  return null //<NotFoundPage />
}
