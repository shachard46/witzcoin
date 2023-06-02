import { createContext, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import AdminPage from './componentes/admin-page'
import CommandList from './componentes/command-list'
import CommandPage, { Command } from './componentes/command/command'
import api from './componentes/hooks/api'
import LoginForm from './componentes/login-form'
import RootLayout from './componentes/root-layout'
import useCommands from './componentes/hooks/get-commands'

export const CommandsContext = createContext<[Command[], Function]>([
  [],
  () => {},
])
export const TokenContext = createContext<[{}, Function]>([{}, () => {}])

function App() {
  const [token, setToken] = useState({})
  const [commands, setCommands] = useState<Command[]>([])
  useCommands(api, commands, setCommands)
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='login' element={<LoginForm />} />
        <Route path='perms' element={<AdminPage />} />
        <Route path='commands' element={<CommandList />} />
        <Route path='command' element={<CommandPage />} />
      </Route>,
    ),
  )
  return (
    <CommandsContext.Provider value={[commands, setCommands]}>
      <TokenContext.Provider value={[token, setToken]}>
        <RouterProvider router={router} />
      </TokenContext.Provider>
    </CommandsContext.Provider>
  )
}

export default App
