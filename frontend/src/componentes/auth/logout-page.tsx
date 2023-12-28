import { useEffect } from 'react'
import { removeToken, useToken } from './token-provider'
import { useNavigate } from 'react-router-dom'

export const LogoutPage: React.FC = () => {
  const navigate = useNavigate()
  const [token, setToken] = useToken()

  useEffect(() => {
    removeToken()
    setToken(undefined)
    navigate('login')
  }, [navigate, setToken, token])
  return null
}
