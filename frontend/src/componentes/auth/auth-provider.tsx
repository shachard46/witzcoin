import { createContext, useContext, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: '',
  scope: '',
  isLoading: true,
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token] = useToken()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsLoading(true)
    setIsLoading(false)
  }, [])
  console.log(token)

  return (
    <AuthContext.Provider
      value={{
        isAutonticated: token ? true : false,
        user: token ? token.access_token.sub.username : '',
        scope: token ? token.access_token.sub.role : '',
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
