import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  constructor(
    transactionName: string,
    buyerUserName: string,
    sellerUserName: string,
    witnessUserName: string,
    category: string,
    details: string,
  ) {
    this.transactionName = transactionName
    this.buyerUserName = buyerUserName
    this.sellerUserName = sellerUserName
    this.witnessUserName = witnessUserName
    this.category = category
    this.details = details
  }
}
