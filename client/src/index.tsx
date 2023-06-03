import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ApiProvider } from './componentes/api/api-provider'
import { AuthProvider } from './componentes/auth/auth-provider'
import { TokenProvider } from './componentes/auth/token-provider'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
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
