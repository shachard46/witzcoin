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

const findKey = (dictionary: Dictionary, url: string): string => {
  for (const key of Object.keys(dictionary)) {
    // alert(key)
    if (url.includes(key)) {
      return key
    }
  }
  return ''
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

  async post<T>(
    url: string,
    data?: any,
    config?: any,
  ): Promise<AxiosResponse<T, any>> {
    while (findKey(this.dictionary, url)) {
      const key = findKey(this.dictionary, url)
      url = url.replace(key, this.dictionary[key])
    }
    return this.api.post<T>(url, data, config)
  }
  async get<T>(url: string, config?: any): Promise<AxiosResponse<T, any>> {
    let [path, params] = url.split('?')
    while (findKey(this.dictionary, path)) {
      const key = findKey(this.dictionary, path)
      path = path.replace(key, this.dictionary[key])
    }
    let final = path
    if (params) {
      final = path + '?' + params
    }
    return this.api.get<T>(final, config)
  }
}
