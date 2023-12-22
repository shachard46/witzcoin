import { DataSource, Repository } from 'typeorm'
import { User } from '../user/user.interface'
import { Injectable } from '@nestjs/common'
import { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT } from 'backend-constants'
import { Transaction } from 'transaction/transaction.interface'

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

  async auth(username: string, password: string): Promise<boolean> {
    return await this.repository.exist({
      where: { username: username, password: password },
    })
  }
}
