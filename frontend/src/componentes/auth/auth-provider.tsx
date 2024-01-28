import { createContext, useContext, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
import { User } from '../transaction/models'
import { useApi } from '../api/api-provider'
const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: null,
  isLoading: true,
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token] = useToken()
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    setIsLoading(true)
    setIsLoading(false)
    if (!token) {
      setUser(null)
      return
    }
    console.log('im first');
    
    api.get(`users/nickholden123`).then(res => setUser(res.data)) // ${token?.data?.sub?.username}
  }, [api, token, user])

  return (
    <AuthContext.Provider
      value={{
        isAutonticated: token ? true : false,
        user: user,
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
