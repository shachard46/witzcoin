import type { ChipProps } from '@mui/material'
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

/** `username` is the stable account id (legacy PK); prefer showing email/fullName when set. */
export interface User {
  username: string
  email: string | null
  fullName: string | null
  balance: number
  pending: number
  role: Role
}

export interface CategoryColors {
  [key: string]: NonNullable<ChipProps['color']>
}
