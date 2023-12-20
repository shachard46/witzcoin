import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { TransactionService } from './services/transaction.service'
import { UserController } from './controllers/user.controller'
import { TransactionController } from './controllers/transaction.controller'

@Module({
  imports: [],
  controllers: [UserController, TransactionController],
  providers: [UserService, TransactionService],
})
export class AppModule {}
