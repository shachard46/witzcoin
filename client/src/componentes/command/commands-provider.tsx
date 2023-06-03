import { useContext, useState } from 'react'
import { Command } from './command'

import { AxiosInstance } from 'axios'
import { createContext } from 'react'
import { deepEqual } from '../../utils'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-provider'
import Provider from '../provider-model'

const CommandsContext = createContext<[Command[], Function]>([[], () => {}])
const getCommands = async (api: AxiosInstance) => {
  return (await api.get<Command[]>('commands')).data
}

export const refreshCommands = (
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
  const { isAutonticated, user, scope } = useAuth()
  const [commands, setCommands] = useState<Command[]>([])
  if (isAutonticated) {
    refreshCommands(api, setCommands, commands)
  }
  return (
    <CommandsContext.Provider
      value={[commands, () => refreshCommands(api, setCommands, commands)]}
    >
      {children}
    </CommandsContext.Provider>
  )
}

export const useCommands = () => {
  const [commands, refreshCommands] = useContext(CommandsContext)
  refreshCommands()
  return commands
}