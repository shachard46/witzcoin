import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column()
  buyerUserName: string

  @Column()
  sellerUserName: string

  @Column()
  witnessUserName: string

  @Column()
  category: string

  @Column()
  details: string

  @Column()
  status: number

  constructor(
    transactionName: string,
    buyerUserName: string,
    sellerUserName: string,
    witnessUserName: string,
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
