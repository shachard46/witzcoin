export interface Token {
  access_token: TokenData
  token_type: string
  
}

export interface TokenData {
  sub: string
  scopes: string
}
export interface Auth {
  isAutonticated: boolean
  user: string
  scope: number
}
