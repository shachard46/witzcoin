import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './userModel'

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

  @ManyToOne(type => User, user => user.bought)
  buyerUserName: User

  @ManyToOne(type => User, user => user.sold)
  sellerUserName: User

  @ManyToOne(type => User, user => user.witnessed)
  witnessUserName: User

  @Column()
  category: string

  @Column()
  details: string

  @Column()
  status: number

  constructor(
    transactionName: string,
    buyerUserName: User,
    sellerUserName: User,
    witnessUserName: User,
    category: string,
    details: string,
    status: number,
  ) {
    this.transactionName = transactionName
    this.buyerUserName = buyerUserName
    this.sellerUserName = sellerUserName
    this.witnessUserName = witnessUserName
    this.category = category
    this.details = details
    this.status = status
  }
}
