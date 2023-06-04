export interface Token {
  access_token: string
  token_type: string
  scope: number
}

export interface Auth {
  isAutonticated: boolean
  user: string
  scope: number
}
