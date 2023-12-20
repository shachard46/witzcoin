import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerUserId' })
  buyerUser: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerUserId' })
  sellerUser: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'witnessUserId' })
  witnessUser: User

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
    category: string,
    details: string,
    status: number,
  ) {
    this.transactionName = transactionName
    this.buyerUser = buyerUser
    this.sellerUser = sellerUser
    this.witnessUser = witnessUser
    this.category = category
    this.details = details
    this.status = status
  }
}
