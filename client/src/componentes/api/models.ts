import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

export interface Dictionary {
  [key: string]: string
}
interface Interceptors {
  request: AxiosInterceptorManager<InternalAxiosRequestConfig>
  response: AxiosInterceptorManager<AxiosResponse>
}

export class Api {
  private api: AxiosInstance
  private dictionary: Dictionary
  interceptors: Interceptors

  constructor(api: AxiosInstance, dictionary: Dictionary) {
    this.api = api
    this.interceptors = api.interceptors
    this.dictionary = dictionary
  }

  post<T>(url: string, data?: any, config?: any) {
    url = this.dictionary[url]
    return this.api.post<T>(url, data, config)
  }
  get<T>(url: string, config?: any) {
    const [path, params] = url.split('?')
    url = this.dictionary[path]
    const final = url + '?' + params
    return this.api.get<T>(final, config)
  }
}
