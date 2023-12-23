import { DataSource, Repository } from 'typeorm'
import { User } from '../user/user.interface'
import { Injectable } from '@nestjs/common'
import { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT } from 'backend-constants'
import {
  Price,
  Transaction,
  UserWaitingTransactions,
} from 'transaction/transaction.interface'
import { TransactionService } from 'transaction/transaction.service'

@Injectable()
export class UserService {
  connection: DataSource
  repository: Repository<User>
  constructor() {
    this.initializeDatabaseConnection()
  }
  private async initializeDatabaseConnection(): Promise<void> {
    this.connection = new DataSource({
      type: 'mysql',
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
  ): Promise<void> {
    await this.repository.update(username, {
      balance: () => `balance + ${price * income}`,
    })
    await this.changePendingByUsername(username, price, income * -1)
  }

  async changePendingByUsername(
    username: string,
    price: number,
    income: number,
  ): Promise<void> {
    await this.repository.update(username, {
      pending: () => `pending + ${price * income}`,
    })
  }
  async updateUsersOnceTransactionApproved(trans: Transaction) {
    this.changeBalanceByUsername(
      trans.buyerUser.username,
      trans.price,
      Price.EXPENSE,
    )
    this.changeBalanceByUsername(
      trans.sellerUser.username,
      trans.price,
      Price.INCOME,
    )
  }
}
