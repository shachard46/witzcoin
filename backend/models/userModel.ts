import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

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
