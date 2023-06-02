import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:5461/api',
})

api.interceptors.request.use(config => {
  //   const [token, setToken] = useContext(TokenContext)
  const token = 'admin'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
