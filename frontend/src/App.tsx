import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginForm from './componentes/auth/login-form'
import RootLayout from './componentes/root-layout'
import CreateDealPage from './componentes/transaction/create-transaction-page'
import { TransactionHistoryPage } from './componentes/transaction/transactions-history-page'
import RegisterPage from './componentes/auth/register-page'
import { LogoutPage } from './componentes/auth/logout-page'
import ProfilePage from './componentes/profile/your-profile'
import { PendingTransactions } from './componentes/transaction/pending-transactions'
import { ManagersPage } from './componentes/protected/manager-page'
import { HomeRedirect } from './componentes/auth/home-redirect'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomeRedirect /> },
        { path: 'login', element: <LoginForm /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'logout', element: <LogoutPage /> },
        { path: 'p/transaction', element: <CreateDealPage /> },
        { path: 'p/pending', element: <PendingTransactions /> },
        { path: 'p/history', element: <TransactionHistoryPage /> },
        { path: 'p/profile', element: <ProfilePage /> },
        { path: 'p/manage', element: <ManagersPage /> },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default App
