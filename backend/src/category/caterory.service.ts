import { DataSource, MoreThan, Repository } from 'typeorm'
import { breakToBase2 } from '../utils'
import {
  Approver,
  Price,
  Transaction,
  UserWaitingTransactions,
} from '../transaction/transaction.interface'
import { User } from '../user/user.interface'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
import { UserService } from '../user/user.service'
import { log } from 'console'
import { Category } from './category.interface'

export class CategoryService {
  connection: DataSource
  repository: Repository<Category>
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
      entities: [Category],
      synchronize: true,
    })
    await this.connection.initialize()
    this.repository = this.connection.getRepository(Category)
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.repository.find()
  }
  async createCategories(category: Category): Promise<Category> {
    return await this.repository.save(category)
  }
}
