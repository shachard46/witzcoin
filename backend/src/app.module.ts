import { Module } from '@nestjs/common'
import { UserService } from './user/user.service'
import { TransactionService } from './transaction/transaction.service'
import { UserController } from './user/user.controller'
import { TransactionController } from './transaction/transaction.controller'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'
import { AuthModule } from 'auth/auth.module'

@Module({
  imports: [TransactionModule, UserModule, AuthModule],
})
export class AppModule {}
