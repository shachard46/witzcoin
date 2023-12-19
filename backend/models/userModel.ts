import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Transaction } from './transactionModel'

@Entity()
export class User {

  @PrimaryColumn()
  username: string

  @Column()
  password: string

  @Column()
  balance: number

  @OneToMany(type => Transaction, bought => bought.buyerUserName)
  bought: Transaction[]
  @OneToMany(type => Transaction, sold => sold.sellerUserName)
  sold: Transaction[]
  @OneToMany(type => Transaction, witnessed => witnessed.witnessUserName)
  witnessed: Transaction[]

  constructor(
    username: string,
    password: string,
    balance: number = 0,
    bought: Transaction[],
    sold: Transaction[],
    witnessed: Transaction[],
  ) {
    this.username = username
    this.password = password
    this.balance = balance
    this.bought = bought
    this.sold = sold
    this.witnessed = witnessed
  }
}
