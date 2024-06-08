import { Role } from '../auth/models'

export interface Transaction {
  buyerUser: string
  sellerUser: string
  witnessUser: string
  transactionName: string
  category: string[]
  price: number
  details: string
  status: Approver
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
