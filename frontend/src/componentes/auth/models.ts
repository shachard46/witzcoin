export interface Token {
  access_token: TokenData
}

export interface TokenData {
  sub: TokenSub
  username: string
}
export interface TokenSub {
  username: string
  role: string
}
export interface Auth {
  isAutonticated: boolean
  user: string
  scope: string
  isLoading: boolean
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export interface LoginUser {
  username: string
  password: string
}

export interface RegisterUser {
  username: string
  password: string
  balance: number
  role: Role
}
