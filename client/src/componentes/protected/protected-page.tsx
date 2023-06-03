import { useAuth } from '../auth/auth-provider'
import { ProtectedPageParams } from './model'

export const ProtectedPage: React.FC<ProtectedPageParams> = ({
  level,
  children,
}) => {
  const { isAutonticated, user, scope } = useAuth()
  if (isAutonticated) {
    if (level > scope) {
      return <div>Not Authorized</div>
    }
    return <div>{children}</div>
  }
  return <div>Not Authonticated</div>
}
