import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ApiProvider } from './componentes/api/api-provider'
import { TokenProvider } from './componentes/auth/token-provider'
import { AuthProvider } from './componentes/auth/auth-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <TokenProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TokenProvider>
    </ApiProvider>
  </React.StrictMode>,
)
