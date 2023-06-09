import { createContext, useContext, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: '',
  scope: 2,
  isLoading: true
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token, refreshToken] = useToken()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(()=>{
    setIsLoading(true)
    setIsLoading(false)
  }, [])
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
          isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
