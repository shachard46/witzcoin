import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import LoginForm from './componentes/auth/login-form'
import { Role } from './componentes/auth/models'
import { ProtectedPage } from './componentes/protected/protected-page'
import RootLayout from './componentes/root-layout'
import CreateDealPage from './componentes/transaction/create-transaction-page'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route path='login' element={<LoginForm />} />
        <Route path='p' element={<RootLayout />}>
            <Route path='transaction' element={<CreateDealPage />} />
        </Route>
      </Route>,
    ),
  )
  return <RouterProvider router={router} />
}

export default App
