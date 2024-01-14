import { User } from "../transaction/models"

export interface Token {
  access_token: string
  data: TokenData
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
  user: User | null
  isLoading: boolean
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  OUT = 'out',
}
export interface LoginUser {
  username: string
  password: string
}

export interface RegisterUser {
  username: string
  password: string
  balance: number
  pending: number
  role: Role
}
