import axios, { AxiosInstance } from 'axios'
import { createContext, ReactNode, useContext } from 'react'

const api = axios.create({
  baseURL: 'http://localhost:5461/api',
})
const ApiContext = createContext<AxiosInstance>(api)

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  return useContext(ApiContext)
}
