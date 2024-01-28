import { createContext, useCallback, useEffect, useState } from 'react'
import Provider from '../provider-model'
import { Auth } from './models'
import { useToken } from './token-provider'
import { User } from '../transaction/models'
import { useApi } from '../api/api-provider'
import { AxiosInstance } from 'axios'
export const AuthContext = createContext<Auth>({
  isAutonticated: false,
  user: null,
  isLoading: true,
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token] = useToken()
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const getUserCallback = useCallback(
    () => getUser(api, setUser),
    [api, user, setUser, token],
  )
  useEffect(() => {
    setIsLoading(true)
    if (!token) {
      setUser(null)
      return
    }
    console.log('im first')
    getUserCallback().finally(() => setIsLoading(false))

    // ${token?.data?.sub?.username}
  }, [api, token])

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
const getUser = (api: AxiosInstance, setUser: (user: User) => void) => {
  return api.get(`users/nickholden123`).then(res => {
    setUser(res.data)
  })
}
