import { User } from "../transaction/models"

export interface Token {
  access_token: string
  /** Opaque refresh JWT; empty if session predates refresh support */
  refresh_token: string
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
  refetchUser: () => Promise<void>
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  OUT = 'out',
}
export interface LoginUser {
  email: string
  password: string
}

export interface RegisterUser {
  email: string
  fullName: string
  password: string
  balance: number
  pending: number
  role: Role
}
