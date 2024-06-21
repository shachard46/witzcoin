import { DataSource, MoreThan, Repository } from 'typeorm'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
import { Category } from './category.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
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

  async getAllCategories(): Promise<string[]> {
    return (await this.repository.find()).map(c => c.name)
  }
  async createCategories(category: Category): Promise<Category> {
    return await this.repository.save(category)
  }
}
