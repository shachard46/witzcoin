import { AxiosInstance, AxiosResponse } from 'axios'
import { EncryptedPayload } from './encryption'
import { Dictionary, Interceptors } from './models'
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
  private encryptedPayload: EncryptedPayload
  interceptors: Interceptors

  constructor(api: AxiosInstance, dictionary: Dictionary) {
    this.api = api
    this.interceptors = api.interceptors
    this.dictionary = dictionary
    this.encryptedPayload = new EncryptedPayload([3, 6, 5, 8, 15, 12])
  }

  async post<T>(
    url: string,
    data?: any,
    config?: any,
    encrypt = false,
  ): Promise<AxiosResponse<T, any> | void> {
    while (findKey(this.dictionary, url)) {
      const key = findKey(this.dictionary, url)
      url = url.replace(key, this.dictionary[key])
    }
    const sent_data = encrypt ? this.encryptedPayload.encrypt(data) : data
    return this.api
      .post<T>(url, sent_data, config)
      .then(res =>
        encrypt ? this.encryptedPayload.decrypt(res.data) : res.data,
      )
  }
  async get<T>(
    url: string,
    config?: any,
    encrypt = false,
  ): Promise<AxiosResponse<T, any> | void> {
    let [path, params] = url.split('?')
    while (findKey(this.dictionary, path)) {
      const key = findKey(this.dictionary, path)
      path = path.replace(key, this.dictionary[key])
    }
    let final = path
    if (params) {
      final = path + '?' + params
    }
    return this.api.get<T>(final, config).then(res => {
      return encrypt ? this.encryptedPayload.decrypt(res.data) : res.data
    })
  }

  async delete<T>(
    url: string,
    config?: any,
  ): Promise<AxiosResponse<T, any> | void> {
    while (findKey(this.dictionary, url)) {
      const key = findKey(this.dictionary, url)
      url = url.replace(key, this.dictionary[key])
    }
    return this.api.delete(url, config)
  }
}
