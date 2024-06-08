/* eslint-disable @typescript-eslint/no-empty-function */
import { jwtDecode } from 'jwt-decode'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApi } from '../api/api-provider'
import Provider from '../provider-model'
import { Token, TokenData } from './models'
import { deepEqual } from '../../utils'

// Create a context to store the token state and updater function
const TokenContext = createContext<
  [Token | undefined, (token: Token | undefined) => void]
>([undefined, () => {}])

// TokenProvider component to provide the token context to its children
export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState<Token | undefined>(getTokenFromStorage())

  // Refresh token callback function
  const refreshToken = useCallback(() => {
    const storageToken = getTokenFromStorage()
    if (storageToken && !deepEqual(token, storageToken)) {
      setToken(storageToken)
    }
  }, [token])

  // Set interceptors callback function
  const setInterceptors = useCallback(() => {
    if (token) {
      api.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${token.access_token}`
        return config
      })
    }
  }, [api, token])

  // Effect to refresh token and set interceptors when the token changes
  useEffect(() => {
    refreshToken()
    setInterceptors()
  }, [refreshToken, setInterceptors])

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}

// Function to get token from local storage
const getTokenFromStorage = (): Token | undefined => {
  const storageToken = localStorage.getItem('token')
  if (storageToken) {
    const parsedToken = JSON.parse(storageToken)
    const verifiedTokenData: TokenData = jwtDecode<{
      access_token: TokenData
    }>(JSON.stringify(parsedToken.data.access_token)).access_token
    console.log('verifiedTokenData: ', verifiedTokenData)

    return {
      data: verifiedTokenData,
      access_token: parsedToken.data.access_token,
    }
  }
  return undefined
}

// Custom hook to use the token context
export const useToken = (): [
  Token | undefined,
  (value: string | undefined) => void,
] => {
  const [stateToken, setToken] = useContext(TokenContext)

  const updateToken = (value: string | undefined) => {
    if (value) {
      localStorage.setItem('token', value)
      const parsedToken = JSON.parse(value)
      const verifiedTokenData: TokenData = jwtDecode<{
        access_token: TokenData
      }>(JSON.stringify(parsedToken.data.access_token)).access_token
      console.log('verifiedTokenData: ', verifiedTokenData)

      const newToken: Token = {
        data: verifiedTokenData,
        access_token: parsedToken.data.access_token,
      }
      console.log('token: ', newToken)
      setToken(newToken)
    } else {
      setToken(undefined)
      localStorage.removeItem('token')
    }
  }

  return [stateToken, updateToken]
}

export const removeToken = () => {
  localStorage.removeItem('token')
}
