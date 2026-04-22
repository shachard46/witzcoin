/* eslint-disable @typescript-eslint/no-empty-function */
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
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

const TOKEN_STORAGE_KEY = 'token'
const AUTH_TOKEN_UPDATED = 'auth-token-updated'

/** Stored shape matches Axios response body wrapper used after login. */
const tokenFromStorageJson = (raw: string): Token => {
  const parsed = JSON.parse(raw) as {
    data: { access_token: string; refresh_token?: string }
  }
  const decoded = jwtDecode<{ access_token: TokenData }>(
    parsed.data.access_token,
  )
  return {
    data: decoded.access_token,
    access_token: parsed.data.access_token,
    refresh_token: parsed.data.refresh_token ?? '',
  }
}

const mergeAccessToken = (raw: string, access_token: string): string => {
  const parsed = JSON.parse(raw) as {
    data: { access_token: string; refresh_token?: string }
  }
  parsed.data = { ...parsed.data, access_token }
  return JSON.stringify(parsed)
}

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken(
  baseURL: string | undefined,
  storedJson: string,
): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    try {
      let refresh_token: string
      try {
        const parsed = JSON.parse(storedJson) as {
          data: { refresh_token?: string }
        }
        refresh_token = parsed.data.refresh_token ?? ''
      } catch {
        return null
      }
      if (!refresh_token) return null

      const { data } = await axios.post<{ access_token: string }>(
        `${baseURL ?? ''}/login/refresh`,
        { refresh_token },
        { headers: { 'Content-Type': 'application/json' } },
      )
      const next = mergeAccessToken(storedJson, data.access_token)
      localStorage.setItem(TOKEN_STORAGE_KEY, next)
      window.dispatchEvent(new Event(AUTH_TOKEN_UPDATED))
      return data.access_token
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.dispatchEvent(new Event(AUTH_TOKEN_UPDATED))
      return null
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

const TokenContext = createContext<
  [Token | undefined, (token: Token | undefined) => void]
>([undefined, () => {}])

export const TokenProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const [token, setToken] = useState<Token | undefined>(getTokenFromStorage)

  useEffect(() => {
    const syncFromStorage = () => {
      setToken(getTokenFromStorage())
    }
    window.addEventListener(AUTH_TOKEN_UPDATED, syncFromStorage)

    const requestId = api.interceptors.request.use(config => {
      const t = getTokenFromStorage()
      if (t?.access_token) {
        config.headers.Authorization = `Bearer ${t.access_token}`
      }
      return config
    })

    const responseId = api.interceptors.response.use(
      r => r,
      async error => {
        const status = error.response?.status
        const originalRequest = error.config as
          | (typeof error.config & { _retry?: boolean })
          | undefined
        if (!originalRequest || status !== 401) {
          return Promise.reject(error)
        }

        const reqUrl = String(originalRequest.url ?? '')
        if (
          reqUrl.includes('login/refresh') ||
          reqUrl.endsWith('/login') ||
          reqUrl.endsWith('login')
        ) {
          return Promise.reject(error)
        }

        if (originalRequest._retry) {
          return Promise.reject(error)
        }
        originalRequest._retry = true

        const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
        if (!stored) return Promise.reject(error)

        const newAccess = await refreshAccessToken(
          api.defaults.baseURL,
          stored,
        )
        if (!newAccess) {
          return Promise.reject(error)
        }

        originalRequest.headers.Authorization = `Bearer ${newAccess}`
        return api(originalRequest)
      },
    )

    return () => {
      window.removeEventListener(AUTH_TOKEN_UPDATED, syncFromStorage)
      api.interceptors.request.eject(requestId)
      api.interceptors.response.eject(responseId)
    }
  }, [api])

  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}

const getTokenFromStorage = (): Token | undefined => {
  const storageToken = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!storageToken) return undefined
  try {
    return tokenFromStorageJson(storageToken)
  } catch {
    return undefined
  }
}

export const useToken = (): [
  Token | undefined,
  (value: string | undefined) => void,
] => {
  const [stateToken, setToken] = useContext(TokenContext)

  const updateToken = useCallback((value: string | undefined) => {
    if (value) {
      localStorage.setItem(TOKEN_STORAGE_KEY, value)
      const newToken = tokenFromStorageJson(value)
      setToken(newToken)
    } else {
      setToken(undefined)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }, [])

  return [stateToken, updateToken]
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
