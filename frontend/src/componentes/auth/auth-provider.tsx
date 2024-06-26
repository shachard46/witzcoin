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
})

export const AuthProvider: React.FC<Provider> = ({ children }) => {
  const [token] = useToken()
  const api = useApi()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchUser = useCallback(
    async (api: AxiosInstance, username: string | undefined) => {
      if (!username) return null
      const response = await api.get(`users/${username}`)
      return response.data
    },
    [],
  )

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true)
      if (!token) {
        setUser(null)
        setIsLoading(false)
        return
      }
      const userData = await fetchUser(api, token?.data.username)
      setUser(userData)
      setIsLoading(false)
    }
    
    initializeUser()
  }, [token, fetchUser, api])

  return (
    <AuthContext.Provider
      value={{
        isAutonticated: !!token,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
