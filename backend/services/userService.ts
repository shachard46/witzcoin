import { DataSource, Repository } from 'typeorm'
import { User } from '../models/userModel'

export class UserService {
  connection: DataSource
  repository: Repository<User>
  constructor(username: string, password: string, balance: number = 0) {
    this.connection = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
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
