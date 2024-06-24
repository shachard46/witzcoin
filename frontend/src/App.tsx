import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import './App.css'
import LoginForm from './componentes/auth/login-form'
import RootLayout from './componentes/root-layout'
import CreateDealPage from './componentes/transaction/create-transaction-page'
import { TransactionHistoryPage } from './componentes/transaction/transactions-history-page'
import RegisterPage from './componentes/auth/register-page'
import { LogoutPage } from './componentes/auth/logout-page'
import ProfilePage from './componentes/profile/your-profile'
import { PendingTransactions } from './componentes/transaction/pending-transactions'
import { ManagersPage } from './componentes/protected/manager-page'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route path='login' element={<LoginForm />} />
        <Route path='logout' element={<LogoutPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='p/transaction' element={<CreateDealPage />} />
        <Route path='p/pending' element={<PendingTransactions />} />
        <Route path='p/history' element={<TransactionHistoryPage />} />
        <Route path='p/profile' element={<ProfilePage />} />
        <Route path='p/manage' element={<ManagersPage />} />
      </Route>,
    ),
  )
  return <RouterProvider router={router} />
}

export default App
