/* eslint-disable @typescript-eslint/no-empty-function */
import { jwtDecode } from 'jwt-decode'
import { createContext, useContext, useEffect, useState } from 'react'
import { deepEqual } from '../../utils'
import { useApi } from '../api/api-provider'
import Provider from '../provider-model'
import { Token } from './models'

const TokenContext = createContext<
  [Token | undefined, (token: Token | undefined) => void]
>([undefined, () => {}])
export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState<Token | undefined>(undefined)

  useEffect(() => {
    refreshToken(token, setToken)
  }, [token])

  useEffect(() => {
    if (token) {
      api.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${JSON.stringify(
          token.access_token,
        )}`
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
    const verified_token = jwtDecode<Token>(storage_token)
    if (typeof verified_token != 'string') {
      return verified_token
    }
  }
  return {}
}

const refreshToken = (
  state_token: Token | undefined,
  setToken: (token: Token) => void,
) => {
  const storage_token = getTokenFromStorage()
  if (
    !deepEqual(storage_token, state_token) &&
    Object.keys(storage_token).length > 1
  ) {
    setToken(storage_token)
  }
}
export const removeToken = () => {
  localStorage.removeItem('token')
}
export const useToken = (): [
  Token | undefined,
  (value: string | undefined) => void,
] => {
  const [state_token, setToken] = useContext(TokenContext)
  return [
    state_token,
    (value: string | undefined) => {
      if (value) localStorage.setItem('token', value)
      refreshToken(state_token, setToken)
    },
  ]
}
