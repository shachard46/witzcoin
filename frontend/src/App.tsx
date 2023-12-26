import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import LoginForm from './componentes/auth/login-form'
import CreateDealPage from './componentes/create-deal-page'
import RootLayout from './componentes/root-layout'
import './App.css'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/'>
        <Route path='p' element={<RootLayout />}>
          <Route path='login' element={<LoginForm />} />
          <Route path='transaction' element={<CreateDealPage />} />
        </Route>
      </Route>,
    ),
  )
  return (
    // <RouterProvider router={router} />
    <div>hello world</div>
  )
}

export default App
