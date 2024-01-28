/* eslint-disable @typescript-eslint/no-empty-function */
import { jwtDecode } from 'jwt-decode'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApi } from '../api/api-provider'
import Provider from '../provider-model'
import { Token, TokenData } from './models'
import { AxiosInstance } from 'axios'

const TokenContext = createContext<
  [Token | undefined, (token: Token | undefined) => void]
>([undefined, () => {}])
export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState<Token | undefined>(undefined)
  const refreshTokenCallback = useCallback(
    () => refreshToken(setToken),
    [token, setToken],
  )
  const setInterceptorsCallback = useCallback(
    () => setInterceptors(api, token),
    [api, token],
  )
  useEffect(() => {
    refreshTokenCallback()
    setInterceptorsCallback()
  }, [])

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}

const getTokenFromStorage = (): Token | undefined => {
  const storage_token = localStorage.getItem('token')
  if (storage_token) {
    const verified_token_data = jwtDecode<TokenData>(storage_token)

    const verified_token: Token = {
      data: verified_token_data,
      access_token: JSON.parse(storage_token).data.access_token,
    }
    console.log(verified_token)
    if (typeof verified_token != 'string') {
      return verified_token
    }
  }
  return undefined
}
const setInterceptors = (api: AxiosInstance, token: Token | undefined) => {
  api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token?.access_token}`
    console.log('nanananan ', config)
    return config
  })
}
const refreshToken = (setToken: (token: Token | undefined) => void) => {
  const storage_token = getTokenFromStorage()
  setToken(storage_token)
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
      refreshToken(setToken)
    },
  ]
}
