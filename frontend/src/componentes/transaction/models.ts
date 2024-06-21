import { Role } from '../auth/models'

export interface Transaction {
  id: number
  buyerUser: string
  sellerUser: string
  witnessUser: string
  transactionName: string
  category: string[]
  price: number
  details: string
  status: Approver
}

export interface TransStatusUpdateDto {
  approvingUser: User
  decline: boolean
}

export enum Approver {
  BUYER = 1,
  SELLER = 2,
  WITNESS = 4,
  DECLINE = 1000,
  NON = 0,
  ALL = 7,
}

export interface User {
  username: string
  balance: number
  pending: number
  role: Role
}

export interface CategoryColors {
  [key: string]: string
}
