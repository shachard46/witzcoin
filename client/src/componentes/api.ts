import axios from 'axios'
import { useContext } from 'react'
import { TokenContext } from '../App'
const api = axios.create({
  baseURL: 'http://localhost:5461/api',
})

api.interceptors.request.use(config => {
  const [token, setToken] = useContext(TokenContext)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
