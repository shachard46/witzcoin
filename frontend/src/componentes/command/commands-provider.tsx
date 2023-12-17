import { useContext, useEffect, useState } from 'react'

import { createContext } from 'react'
import { deepEqual } from '../../utils'
import { Api } from '../api/api'
import { useApi } from '../api/api-provider'
import { useAuth } from '../auth/auth-provider'
import Provider from '../provider-model'
import { Command } from './models'

const CommandsContext = createContext<[Command[], Function, Function]>([
  [],
  () => {},
  () => {},
])
const getCommands = async (api: Api) => {
  return await api.get<Command[]>('commands')
}

const refreshCommands = (
  api: Api,
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

const deleteCommand = (api: Api, alias: string) => {
  api.delete(`commands/${alias}`)
}
export const CommandsProvider: React.FC<Provider> = ({ children }) => {
  const api = useApi()
  const auth = useAuth()
  const [commands, setCommands] = useState<Command[]>([])
  useEffect(() => {
    if (auth.isAutonticated) {
      refreshCommands(api, setCommands, commands)
    } else {
      setCommands([])
    }
  }, [auth.isAutonticated, api, commands, setCommands])

  return (
    <CommandsContext.Provider
      value={[
        commands,
        () => refreshCommands(api, setCommands, commands),
        (alias: string) => {
          deleteCommand(api, alias)
          refreshCommands(api, setCommands, commands)
        },
      ]}
    >
      {children}
    </CommandsContext.Provider>
  )
}

export const useCommands = () => {
  return useContext(CommandsContext)
}
