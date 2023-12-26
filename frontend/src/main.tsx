import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApiProvider } from './componentes/api/api-provider.tsx'
import { TokenProvider } from './componentes/auth/token-provider.tsx'
import { AuthProvider } from './componentes/auth/auth-provider.tsx'

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
