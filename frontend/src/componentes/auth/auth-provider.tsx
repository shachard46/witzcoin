import React, { createContext, useCallback, useEffect, useState } from 'react'
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
  refetchUser: async () => {},
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token] = useToken()
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchCurrentUser = useCallback(
    async (client: AxiosInstance): Promise<User | null> => {
      try {
        const response = await client.get<User>('users/me')
        return response.data
      } catch {
        return null
      }
    },
    [],
  )

  const refetchUser = useCallback(async () => {
    if (!token) {
      setUser(null)
      return
    }
    const userData = await fetchCurrentUser(api)
    setUser(userData)
  }, [token, api, fetchCurrentUser])

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true)
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }
      const userData = await fetchCurrentUser(api)
      setUser(userData)
      setIsLoading(false)
    }

    initializeUser()
  }, [token, fetchCurrentUser, api])

  return (
    <AuthContext.Provider
      value={{
        isAutonticated: !!token,
        user,
        isLoading,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
