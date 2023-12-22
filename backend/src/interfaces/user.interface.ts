import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Transaction } from './transaction.interface'

@Entity()
export class User {
  @PrimaryColumn()
  username: string

  @Column()
  password: string

  @Column()
  balance: number

  constructor(username: string, password: string, balance: number = 0) {
    this.username = username
    this.password = password
    this.balance = balance
  }
}

export class AuthUserDto {
  username: string
  password: string
}
