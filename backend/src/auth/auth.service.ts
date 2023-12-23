import { DataSource, Repository } from 'typeorm'
import { AuthUserDto, User } from '../user/user.interface'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
import { Transaction } from '../transaction/transaction.interface'
import { JwtService } from '@nestjs/jwt'
import { log } from 'console'
import { UserService } from 'user/user.service'

@Injectable()
export class AuthService {
  connection: DataSource
  repository: Repository<User>
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
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

  async signIn(user: AuthUserDto): Promise<any> {
    const authorized = await this.repository.exist({
      where: { username: user.username, password: user.password },
    })
    if (!authorized) return new UnauthorizedException()
    const exitsingUser = await this.userService.getUserByUsername(user.username)
    const payload = {
      sub: { username: user.username, role: exitsingUser.role },
      username: user.username,
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
