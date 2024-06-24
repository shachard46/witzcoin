import { DataSource, Repository } from 'typeorm'
import { User } from '../user/user.interface'
import { Injectable } from '@nestjs/common'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
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
      logging: true,
      entities: [User],
      synchronize: true,
    })
    await this.connection.initialize()
    this.repository = this.connection.getRepository(User)
  }
  async createUser(user: User): Promise<User> {
    if (await this.repository.findOne({ where: { username: user.username } }))
      return user
    await this.repository.save(user)
    return user
  }
  async getUserByUsername(username: string): Promise<User | null> {
    console.log('username: ', username)

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
