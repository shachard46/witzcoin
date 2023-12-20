import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { TransactionService } from './services/transaction.service'
import { UserController } from './controllers/user.controller'
import { TransactionController } from './controllers/transaction.controller'
import { TransactionModule } from './modules/transaction.module'
import { UserModule } from './modules/user.module'

@Module({
  imports: [TransactionModule, UserModule],
})
export class AppModule {}
