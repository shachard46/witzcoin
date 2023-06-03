import axios, { AxiosInstance } from 'axios'
import { createContext, ReactNode, useContext } from 'react'

const ApiContext = createContext<AxiosInstance>(axios.create())

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const api = axios.create({
    baseURL: 'http://localhost:5461/api',
  })
  api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer admin`//${token.access_token}`
    return config
  })
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  return useContext(ApiContext)
}
