import { randomBytes } from 'crypto'
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import {
  RegisterUserDto,
  UpdateProfileDto,
  User,
} from '../user/user.interface'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
import { Role } from '../auth/auth.interfaces'
import {
  Price,
  Transaction,
  UserWaitingTransactions,
} from '../transaction/transaction.interface'
import { TransactionService } from '../transaction/transaction.service'

@Injectable()
export class UserService {
  connection: DataSource
  repository: Repository<User>
  constructor() {
    this.initializeDatabaseConnection()
  }
  async initializeDatabaseConnection(): Promise<void> {
    this.connection = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      logging: false,
      entities: [User],
      synchronize: process.env.DB_SYNCHRONIZE !== '0',
    })
    await this.connection.initialize()
    this.repository = this.connection.getRepository(User)
  }
  async createUser(user: User): Promise<User> {
    if (await this.repository.findOne({ where: { username: user.username } }))
      return user
    if (user.email == null) user.email = null
    if (user.fullName == null) user.fullName = null
    await this.repository.save(user)
    return user
  }

  /** Sign-up: creates user with generated username PK from email + full name. */
  async registerWithEmail(dto: RegisterUserDto): Promise<User> {
    const email = dto.email?.trim().toLowerCase()
    const fullName = dto.fullName?.trim()
    const password = dto.password
    if (!email || !this.isValidEmail(email)) {
      throw new BadRequestException('Valid email is required')
    }
    if (!fullName) {
      throw new BadRequestException('Full name is required')
    }
    if (!password) {
      throw new BadRequestException('Password is required')
    }
    const taken = await this.repository.findOne({ where: { email } })
    if (taken) {
      throw new ConflictException('Email already registered')
    }
    const username = await this.generateUniqueUsernameFromEmail(email)
    const role = dto.role ?? Role.USER
    const user = new User(username, password, 0, 0, role, email, fullName)
    await this.repository.save(user)
    return user
  }

  private isValidEmail(s: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  }

  private async generateUniqueUsernameFromEmail(email: string): Promise<string> {
    const local = email
      .split('@')[0]
      ?.replace(/[^a-zA-Z0-9_]/g, '')
      .slice(0, 24)
    let base = (local && local.length > 0 ? local : 'user').toLowerCase()
    let candidate = base
    for (let i = 0; i < 20; i++) {
      const existing = await this.repository.findOne({
        where: { username: candidate },
      })
      if (!existing) return candidate
      const suffix = randomBytes(3).toString('hex')
      candidate = `${base.slice(0, 20)}_${suffix}`
    }
    return `u_${randomBytes(12).toString('hex')}`
  }

  /**
   * Resolves login: match normalized email first, then legacy username PK.
   */
  async findUserForLogin(identifier: string, password: string): Promise<User | null> {
    const trimmed = identifier?.trim()
    if (!trimmed || !password) return null
    let user: User | null = null
    if (this.isValidEmail(trimmed)) {
      const email = trimmed.toLowerCase()
      user = await this.repository.findOne({ where: { email } })
    }
    if (!user) {
      user = await this.repository.findOne({ where: { username: trimmed } })
    }
    if (!user || user.password !== password) return null
    return user
  }

  async updateProfile(
    username: string,
    dto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.getUserByUsername(username)
    if (!user) {
      throw new BadRequestException('User not found')
    }
    if (dto.email !== undefined) {
      const email = dto.email?.trim().toLowerCase() || null
      if (email && !this.isValidEmail(email)) {
        throw new BadRequestException('Invalid email')
      }
      if (email) {
        const other = await this.repository.findOne({ where: { email } })
        if (other && other.username !== username) {
          throw new ConflictException('Email already in use')
        }
      }
      user.email = email
    }
    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName?.trim() || null
    }
    await this.repository.save(user)
    return user
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({ where: { username: username } })
  }

  async getAllUsers(): Promise<User[]> {
    return await this.repository.find()
  }

  async changeBalanceByUsername(
    username: string,
    price: number,
    income: number,
    decline: boolean,
    noPending: boolean = false,
  ): Promise<void> {
    if (!decline) {
      await this.repository.update(username, {
        balance: () => `balance + ${price * income}`,
      })
    }
    if (noPending) return
    await this.changePendingByUsername(username, price, income * -1, decline)
  }

  async changePendingByUsername(
    username: string,
    price: number,
    income: number,
    decline: boolean,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(User)
      .set({
        pending: () => `pending + ${price * income * (decline ? -1 : 1)}`,
      })
      .where('username = :username', { username })
      .execute()
  }
  async updateUsersOnceTransactionDone(trans: Transaction, decline: boolean) {
    await this.changeBalanceByUsername(
      trans.buyerUser.username,
      trans.price,
      Price.EXPENSE,
      decline,
    )
    await this.changeBalanceByUsername(
      trans.sellerUser.username,
      trans.price,
      Price.INCOME,
      decline,
    )
  }
  async updateUsersOnceTransactionInvalidated(trans: Transaction) {
    await this.changeBalanceByUsername(
      trans.buyerUser.username,
      -trans.price,
      Price.EXPENSE,
      false,
    )
    await this.changeBalanceByUsername(
      trans.sellerUser.username,
      -trans.price,
      Price.INCOME,
      false,
    )
  }
}
