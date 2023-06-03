import axios, { AxiosInstance } from 'axios'
import { createContext, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import AdminPage from './componentes/admin-page'
import getApi from './componentes/api/api-providfer'
import LoginForm from './componentes/auth/login-form'
import CommandList from './componentes/command-list'
import CommandPage, { Command } from './componentes/command/command'
import useCommands from './componentes/command/commands-provider'
import RootLayout from './componentes/root-layout'

export const CommandsContext = createContext<[Command[], Function]>([
  [],
  () => {},
])

export const TokenContext = createContext<[Token, Function]>([
  { access_token: '', token_type: '' },
  () => {},
])
export const ApiContext = createContext<AxiosInstance>(axios.create())

function App() {
  const [token, setToken] = useState<Token>({
    access_token: '',
    token_type: '',
  })
  const [commands, setCommands] = useState<Command[]>([])
  const api = getApi(token.access_token)
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
