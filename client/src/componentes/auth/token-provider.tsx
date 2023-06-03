import { createContext, useContext, useState } from 'react'
import { deepEqual } from '../../utils'
import { useApi } from '../api/api-provider'
import Provider from '../provider-model'
import { Token } from './models'

const TokenContext = createContext<[Token, Function]>([
  {
    access_token: '',
    token_type: '',
  },
  () => {},
])

export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState({
    access_token: '',
    token_type: '',
  })
  refreshToken(token, setToken)
  if (token) {
    api.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${token.access_token}`
      return config
    })
  }
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

const refreshToken = (state_token: Token, setToken: Function) => {
  const storage_token = getTokenFromStorage()
  if (!deepEqual(storage_token, state_token)) {
    setToken(storage_token)
  }
}

export const useToken = (): [Token, Function] => {
  const [state_token, setToken] = useContext(TokenContext)
  return [
    state_token,
    (value: string) => {
      localStorage.setItem('token', value)
      refreshToken(state_token, setToken)
    },
  ]
}
