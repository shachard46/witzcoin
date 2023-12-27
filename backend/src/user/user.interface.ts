import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Role } from '../auth/auth.interfaces'

@Entity()
export class User {
  @PrimaryColumn()
  username: string

  @Column()
  password: string

  @Column()
  balance: number
  @Column()
  pending: number
  @Column()
  role: Role

  toOutUser(): OutUser {
    return {
      username: this.username,
      balance: this.balance,
      pending: this.pending,
      role: this.role,
    }
  }
  constructor(
    username: string,
    password: string,
    balance: number = 0,
    pending: number = 0,
    role: Role,
  ) {
    this.username = username
    this.password = password
    this.balance = balance
    this.pending = pending
    this.role = role
  }
}

export class AuthUserDto {
  username: string
  password: string
}

export interface OutUser {
  username: string
  balance: number
  pending: number
  role: Role
}
