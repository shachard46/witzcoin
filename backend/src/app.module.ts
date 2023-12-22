import { Module } from '@nestjs/common'
import { UserService } from './user/user.service'
import { TransactionService } from './transaction/transaction.service'
import { UserController } from './user/user.controller'
import { TransactionController } from './transaction/transaction.controller'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [TransactionModule, UserModule],
})
export class AppModule {}
