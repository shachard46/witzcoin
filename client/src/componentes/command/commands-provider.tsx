import { useContext, useEffect, useState } from 'react'

import { AxiosInstance } from 'axios'
import { createContext } from 'react'
import { deepEqual } from '../../utils'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-provider'
import Provider from '../provider-model'
import { Command } from './models'
import { Api } from '../api/models'

const CommandsContext = createContext<[Command[], Function]>([[], () => {}])
const getCommands = async (api: Api) => {
  return (await api.get<Command[]>('commands')).data
}

const refreshCommands = (
  api: AxiosInstance,
  setCommands: Function,
  commands: Command[],
) => {
  getCommands(api)
    .then(res => {
      if (!deepEqual(commands, res)) {
        setCommands(res)
      }
    })
    .catch(err => {})
}
export const CommandsProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const auth = useAuth()
  const [commands, setCommands] = useState<Command[]>([])
  useEffect(() => {
    if (auth.isAutonticated) {
      refreshCommands(api, setCommands, commands)
    }
  }, [auth.isAutonticated, api, commands])
  return (
    <CommandsContext.Provider
      value={[commands, () => refreshCommands(api, setCommands, commands)]}
    >
      {children}
    </CommandsContext.Provider>
  )
}

export const useCommands = () => {
  return useContext(CommandsContext)
}
