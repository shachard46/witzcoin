import { DataSource } from 'typeorm'
import { User } from './user/user.interface'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './backend-constants'

/**
 * CLI entry for TypeORM migrations (`npm run migration:run`).
 * Keep options aligned with {@link UserService} / {@link AuthService}.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  entities: [User],
  migrations: [__dirname + '/migrations/*.js'],
  synchronize: false,
})
