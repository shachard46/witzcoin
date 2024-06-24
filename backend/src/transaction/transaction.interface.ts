import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { OutUser, User } from '../user/user.interface'
import { stat } from 'fs'

export enum Approver {
  BUYER = 1,
  SELLER = 2,
  WITNESS = 4,
  DECLINE = 1000,
  NON = 0,
  ALL = 7,
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  transactionName: string

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'buyerUserId' })
  buyerUser: User

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sellerUserId' })
  sellerUser: User

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'witnessUserId' })
  witnessUser: User
  @Column()
  price: number
  @Column()
  category: string

  @Column()
  details: string

  @Column()
  status: number

  constructor(
    transactionName: string,
    buyerUser: User,
    sellerUser: User,
    witnessUser: User,
    price: number,
    category: string,
    details: string,
    status: number,
  ) {
    this.transactionName = transactionName
    this.buyerUser = buyerUser
    this.sellerUser = sellerUser
    this.witnessUser = witnessUser
    this.price = price
    this.category = category
    this.details = details
    this.status = status
  }
}

export class UserWaitingTransactions {
  bought: number = 0
  sold: number = 0
}

export enum Price {
  INCOME = 1,
  EXPENSE = -1,
}
export class TransStatusUpdateDto {
  approvingUser: User
  decline: boolean
}
export class TransactionCreationDto {
  transaction: OutTransaction
  issuingUsername: string
}
export class TransInvalidationUpdateDto {
  user: User
}
export interface OutTransaction {
  id: number
  transactionName: string
  buyerUser: string
  sellerUser: string
  witnessUser: string
  price: number
  category: string[]
  details: string
  status: number
}

export const toOutTransaction = (trans: Transaction): OutTransaction => {
  let cat: string[] = []
  try {
    cat = eval(trans.category.replace('{', '[').replace('}', ']'))
  } catch {
    cat = trans.category.split(',')
  }
  return {
    id: trans.id,
    buyerUser: trans.buyerUser.username,
    sellerUser: trans.sellerUser.username,
    witnessUser: trans.witnessUser.username,
    price: trans.price,
    category: cat,
    details: trans.details,
    status: trans.status,
    transactionName: trans.transactionName,
  }
}
