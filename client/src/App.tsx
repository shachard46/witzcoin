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
import LoginForm from './componentes/auth/login-form'
import CommandList from './componentes/command/command-list'
import CommandPage, { Command } from './componentes/command/command'
import useCommands, {
  CommandsProvider,
} from './componentes/command/commands-provider'
import RootLayout from './componentes/root-layout'

export const TokenContext = createContext<[Token, Function]>([
  { access_token: '', token_type: '' },
  () => {},
])

function App() {
  const [token, setToken] = useState<Token>({
    access_token: '',
    token_type: '',
  })
  const [commands, setCommands] = useState<Command[]>([])
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
    <CommandsProvider>
      <TokenContext.Provider value={[token, setToken]}>
        <RouterProvider router={router} />
      </TokenContext.Provider>
    </CommandsProvider>
  )
}

export default App
