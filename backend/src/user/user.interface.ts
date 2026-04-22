import { Column, Entity, Index, PrimaryColumn } from 'typeorm'
import { Role } from '../auth/auth.interfaces'

/**
 * Primary identifier. Prefer signing in with {@link User.email}; username remains
 * the stable PK and appears in escrow party fields (deprecated for display).
 */
@Entity()
@Index('UQ_user_email_partial', ['email'], {
  unique: true,
  where: '"email" IS NOT NULL',
})
export class User {
  /** @deprecated Use email for login; kept as primary key for existing FKs. */
  @PrimaryColumn()
  username: string

  @Column()
  password: string

  /** Login identifier; unique when set (multiple NULL allowed in PostgreSQL). */
  @Column({ nullable: true })
  email: string | null

  @Column({ nullable: true })
  fullName: string | null

  @Column()
  balance: number
  @Column()
  pending: number
  @Column()
  role: Role

  constructor(
    username: string,
    password: string,
    balance: number = 0,
    pending: number = 0,
    role: Role,
    email: string | null = null,
    fullName: string | null = null,
  ) {
    this.username = username
    this.password = password
    this.balance = balance
    this.pending = pending
    this.role = role
    this.email = email
    this.fullName = fullName
  }
}

/** Login body: primary field is email; legacy accounts may use username in the same field. */
export class AuthUserDto {
  email: string
  password: string
}

export class RegisterUserDto {
  email: string
  fullName: string
  password: string
  role?: Role
}

export class UpdateProfileDto {
  email?: string
  fullName?: string
}

export interface OutUser {
  username: string
  email: string | null
  fullName: string | null
  balance: number
  pending: number
  role: Role
}

export const toOutUser = (user: User): OutUser => {
  return {
    username: user.username,
    email: user.email ?? null,
    fullName: user.fullName ?? null,
    balance: user.balance,
    pending: user.pending,
    role: user.role,
  }
}
