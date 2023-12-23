import axios, { AxiosInstance } from 'axios'
import { createContext, ReactNode, useContext } from 'react'

const ApiContext = createContext<AxiosInstance>(axios.create())
export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const api = axios.create({
    baseURL: 'http://localhost:3001/api',
  })

  return (
    <ApiContext.Provider value={api}>{children}</ApiContext.Provider>
  )
}

export const useApi = () => {
  return useContext(ApiContext)
}
