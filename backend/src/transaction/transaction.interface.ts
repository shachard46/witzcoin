import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../user/user.interface'

export enum Approver {
  BUYER = 1,
  SELLER = 2,
  WITNESS = 4,
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
