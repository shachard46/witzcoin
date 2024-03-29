import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Provider from '../provider-model'
import { useCommands } from './commands-provider'
import { Command } from './models'

const getCommandFromQuery = (
  queryParams: URLSearchParams,
  commands: Command[],
): Command | null => {
  const commandName = queryParams.get('name')

  const command = commands.find(c => c.name === commandName)
  if (!command) {
    return null
  }
  return command
}
const CommandContext = createContext<Command>({
  name: '',
  alias: '',
  params: {},
})

export const CommandProvider: React.FC<Provider> = ({ children }) => {
  const [commands, refreshCommands] = useCommands()
  const location = useLocation()
  const navigate = useNavigate()
  const [command, setCommand] = useState<Command | null>(null)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (commands.length === 0) {
      refreshCommands()
    }
    setCommand(getCommandFromQuery(queryParams, commands))

    // if (command === null) {
    //   navigate('/p/commands')
    // }
  }, [location, navigate, command, refreshCommands, commands])
  if (command == null) {
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
