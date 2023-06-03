import { createContext, useContext, useState } from 'react'
import { deepEqual } from '../../utils'
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
  const [token, setToken] = useState({
    access_token: '',
    token_type: '',
  })
  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}

const get_token_from_storage = () => {
  const storage_token = localStorage.getItem('token')
  if (storage_token) {
    return JSON.parse(storage_token)
  }
  return {}
}

export const useToken = () => {
  const storage_token = get_token_from_storage()
  const [state_token, setToken] = useContext(TokenContext)
  if (!deepEqual(storage_token, state_token)) {
    setToken(storage_token)
  }
  return state_token
}
