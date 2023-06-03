import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import AdminPage from './componentes/admin-page'
import LoginForm from './componentes/auth/login-form'
import CommandPage from './componentes/command/command'
import CommandList from './componentes/command/command-list'
import { CommandProvider } from './componentes/command/command-provider'
import { CommandsProvider } from './componentes/command/commands-provider'
import RootLayout from './componentes/root-layout'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='login' element={<LoginForm />} />
        <Route path='perms' element={<AdminPage />} />
        <Route path='commands' element={<CommandList />} />
        <Route
          path='command'
          element={
            <CommandProvider>
              <CommandPage />
            </CommandProvider>
          }
        />
      </Route>,
    ),
  )
  return (
    <CommandsProvider>
      <RouterProvider router={router} />
    </CommandsProvider>
  )
}

export default App
