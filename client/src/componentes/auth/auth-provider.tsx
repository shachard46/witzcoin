import { createContext, useContext } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: '',
  scope: 0,
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const token = useToken()
  const status: Auth = {
    isAutonticated: token ? true : false,
    user: token.access_token,
    scope: 0,
  }
  return <AuthContext.Provider value={status}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
