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
  ): Promise<AxiosResponse<T, any> | void> {
    while (findKey(this.dictionary, url)) {
      const key = findKey(this.dictionary, url)
      url = url.replace(key, this.dictionary[key])
    }
    return this.api
      .post<T>(url, this.encryptedPayload.encrypt(data), config)
      .then(res => this.encryptedPayload.decrypt(res.data))
  }
  async get<T>(
    url: string,
    config?: any,
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
    return this.api
      .get<T>(final, config)
      .then(res => this.encryptedPayload.decrypt(res.data))
  }
}

type PayloadData = {} | [] | string | any

export class EncryptedPayload {
  private key: number[]
  private reverseKey: number[]

  constructor(key: number[]) {
    this.key = key
    this.reverseKey = key.map(val => -val)
  }

  shift_character(shift: number, char: string) {
    const shift_range = char === char.toUpperCase() ? [65, 90] : [97, 122]
    let shifted_char = char.charCodeAt(0) + shift
    if (shifted_char > shift_range[1]) {
      shifted_char = shift_range[0] + (shifted_char - shift_range[1])
    } else if (shifted_char < shift_range[0]) {
      shifted_char = shift_range[1] - (shift_range[0] - shifted_char)
    }
    return String.fromCharCode(shifted_char)
  }

  shift_word(word: string, dec: boolean = false) {
    let new_word: string[] = []
    let shift_index = 0
    const key = dec ? this.reverseKey : this.key
    for (const char of word) {
      shift_index += 1
      if (shift_index === key.length) {
        shift_index = 0
      }
      new_word.push(this.shift_character(key[shift_index], char))
    }
    return new_word.join('')
  }

  enc_dec_data(data: PayloadData, dec: boolean = true) {
    if (data instanceof Array) {
      let enc_data: PayloadData = []
      for (const item in data) {
        enc_data.push(this.enc_dec_data(item, dec))
      }
      return enc_data
    } else if (data instanceof Object) {
      let enc_data: { [key: string]: string | {} } = {}
      Object.entries(data).forEach(([key, value]) => {
        if (data instanceof Object) {
          enc_data[this.shift_word(key, dec)] = this.enc_dec_data(value, dec)
        } else if (typeof value == 'string') {
          enc_data[this.shift_word(key, dec)] = this.shift_word(value, dec)
        }
      })
      return enc_data
    }
    return this.shift_word(data, dec)
  }

  decrypt(data: PayloadData) {
    this.enc_dec_data(data, true)
  }
  encrypt(data: PayloadData) {
    this.enc_dec_data(data)
  }
}
