import { DataSource, Repository } from 'typeorm'
import { User } from '../interfaces/user.interface'
import { Injectable } from '@nestjs/common'
import { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT } from 'backend-constants'

@Injectable()
export class UserService {
  connection: DataSource
  repository: Repository<User>
  constructor() {
    this.connection = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      synchronize: true,
      logging: true,
      entities: [User],
    })
    this.repository = this.connection.getRepository(User)
  }
  async createUser(user: User): Promise<User> {
    await this.repository.save(user)
    return user
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username: username } })
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.find()
  }

  async auth(username: string, password: string): Promise<boolean> {
    return this.repository.exist({
      where: { username: username, password: password },
    })
  }
}
