import { createContext, useContext } from 'react'
import { useApi } from '../api/api-provider'
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
  const api = useApi()
  const status: Auth = {
    isAutonticated: token ? true : false,
    user: token.access_token,
    scope: 0,
  }
  if (status.isAutonticated) {
    api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token.access_token}`
      return config
    })
  }
  return <AuthContext.Provider value={status}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
