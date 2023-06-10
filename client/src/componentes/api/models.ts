import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import fernet, { Fernet } from 'fernet'

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

export class EncryptedPayload {
  private key: string
  private chipher: Fernet
  private token: fernet.Token

  constructor(key: string) {
    this.key = this.generateKey(key)
    this.chipher = new fernet()
  }

  generateKey(key: string) {
    let to_encode = ''
    while (to_encode.length < 32) {
      to_encode += key
    }
    return urlSafeBase64Encode(to_encode.substring(0, 32))
  }

  encode(payload: {}) {
    const token = new fernet.Token({
      secret: secret,
      time: Date.parse(1),
      iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    })
    token.encode('Message')
  }
}

function urlSafeBase64Encode(data: string): string {
  const buffer = Buffer.from(data, 'utf-8')
  const base64 = buffer.toString('base64')
  const urlSafeBase64 = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return urlSafeBase64
}
