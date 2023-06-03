import axios from 'axios'

const getApi = (token: string) => {
  const api = axios.create({
    baseURL: 'http://localhost:5461/api',
  })
  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  return api
}

export default getApi
