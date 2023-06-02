import { createContext, useState } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import AdminPage from './componentes/admin-page'
import api from './componentes/api'
import CommandList from './componentes/command-list'
import CommandPage, { Command } from './componentes/command/command'
import LoginForm from './componentes/login-form'
import RootLayout from './componentes/root-layout'

export const CommandsContext = createContext<Command[]>([])
export const TokenContext = createContext<[{}, Function]>([{}, () => {}])

const loadCommands = async (setCommands: Function) => {
  api
    .get<Command[]>('commands')
    .then(res => {
      setCommands(res.data)
      return res.data
    })
    .catch(err => {
      return err
    })
}

function App() {
  const [token, setToken] = useState({})
  const [commands, setCommands] = useState<Command[]>([]) //
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='login' element={<LoginForm />} />
        <Route path='perms' element={<AdminPage />} />
        <Route
          path='commands'
          element={<CommandList />}
          loader={() => loadCommands(setCommands)}
        />
        <Route path='command' element={<CommandPage />} />
      </Route>,
    ),
  )
  return (
    <CommandsContext.Provider value={commands}>
      <TokenContext.Provider value={[token, setToken]}>
        <RouterProvider router={router} />
      </TokenContext.Provider>
    </CommandsContext.Provider>
  )
}

export default App
