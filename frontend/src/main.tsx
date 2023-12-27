import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApiProvider } from './componentes/api/api-provider'
import { AuthProvider } from './componentes/auth/auth-provider'
import { TokenProvider } from './componentes/auth/token-provider'
import { TransactionsProvider } from './componentes/transaction/transactions-provider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <TokenProvider>
        <AuthProvider>
          <TransactionsProvider>
            <App />
          </TransactionsProvider>
        </AuthProvider>
      </TokenProvider>
    </ApiProvider>
  </React.StrictMode>,
)
