import axios from 'axios'
import { createContext, ReactNode, useContext } from 'react'
import { Api, Dictionary } from './models'

const ApiContext = createContext<Api>(new Api(axios.create(), {}))
const dictionary: Dictionary = {
  commands: 'wiki',
  perms: 'videos',
  command: 'game',
  run: 'play',
}
export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const api = axios.create({
    baseURL: 'http://localhost:5461/api',
  })

  const custom_api = new Api(api, dictionary)

  return (
    <ApiContext.Provider value={custom_api}>{children}</ApiContext.Provider>
  )
}

export const useApi = () => {
  return useContext(ApiContext)
}
