import { useContext, useState } from 'react'
import { deepEqual } from '../../utils'
import { Command } from './command'

import { createContext, ReactNode } from 'react'
import { useApi } from '../api/api-provider'

const CommandsContext = createContext<Command[]>([])

export const CommandsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api = useApi()
  const [commands, setCommands] = useState<Command[]>([])
  api
    .get<Command[]>('commands')
    .then(res => {
      if (!deepEqual(commands, res.data)) {
        setCommands(res.data)
      }
      return res.data
    })
    .catch(err => {
      return err
    })
  return (
    <CommandsContext.Provider value={commands}>
      {children}
    </CommandsContext.Provider>
  )
}

export const useCommands = () => {
  return useContext(CommandsContext)
}

