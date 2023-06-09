import { createContext, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Provider from '../provider-model'
import { useCommands } from './commands-provider';
import { Command } from './models'

const getCommandFromQuery = (
  queryParams: URLSearchParams,
  commands: Command[],
) => {
  const commandName = queryParams.get('name')
  const command = commands.find(c => c.name === commandName)
  if (!command) {
    return null
  }
  return command
}
const CommandContext = createContext<Command>({ name: '', params: {} })

export const CommandProvider: React.FC<Provider> = ({ children }) => {
  const [commands, refreshCommands] = useCommands()
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const command = getCommandFromQuery(queryParams, commands)
  if (command === null) {
    navigate('/commands')
    return null
  }
  return (
    <CommandContext.Provider value={command}>
      {children}
    </CommandContext.Provider>
  )
}

export const useCommand = (): Command => {
  return useContext(CommandContext)
}
