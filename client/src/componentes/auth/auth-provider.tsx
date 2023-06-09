import { createContext, useContext } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: '',
  scope: 2,
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token, refreshToken] = useToken()
  return (
    <AuthContext.Provider
      value={{
        isAutonticated: token ? true : false,
        user: token ? token.access_token.sub : '',
        scope: !token
          ? 2
          : token.access_token.scopes === 'admin'
          ? 0
          : token.access_token.scopes === 'user'
          ? 1
          : 2,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
