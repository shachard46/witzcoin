import { createContext, ReactNode, useContext, useState } from 'react'
import { deepEqual } from '../../utils'
import { Token } from './models'
import Provider from '../provider-model'

const TokenContext = createContext<[Token, Function]>([
  {
    access_token: '',
    token_type: '',
  },
  () => {},
])

export const TokenProvider: React.FC<Provider> = ({
  children,
}) => {
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

export const useToken = () => {
  const storage_token = localStorage.getItem('token')
  const [state_token, setToken] = useContext(TokenContext)
  if (!deepEqual(storage_token, state_token)) {
    setToken(storage_token)
  }
  return state_token
}

// api.interceptors.request.use(config => {
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })
