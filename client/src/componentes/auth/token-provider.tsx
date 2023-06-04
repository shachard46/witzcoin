import { createContext, useContext, useEffect, useState } from 'react'
import { deepEqual } from '../../utils'
import { useApi } from '../api/api-provider'
import Provider from '../provider-model'
import { Token } from './models'

const TokenContext = createContext<[Token | undefined, Function]>([
  undefined,
  () => {},
])

export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState<Token | undefined>(undefined)

  useEffect(() => {
    refreshToken(token, setToken)
  }, [token])

  useEffect(() => {
    if (token) {
      api.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${token.access_token}`
        return config
      })
    }
  }, [api, token])

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}

const getTokenFromStorage = () => {
  const storage_token = localStorage.getItem('token')
  if (storage_token) {
    return JSON.parse(storage_token)
  }
  return {}
}

const refreshToken = (state_token: Token | undefined, setToken: Function) => {
  const storage_token = getTokenFromStorage()
  if (
    !deepEqual(storage_token, state_token) &&
    Object.keys(storage_token).length > 1
  ) {
    setToken(storage_token)
  }
}

export const useToken = (): [Token | undefined, Function] => {
  const [state_token, setToken] = useContext(TokenContext)
  return [
    state_token,
    (value: string) => {
      localStorage.setItem('token', value)
      refreshToken(state_token, setToken)
    },
  ]
}
