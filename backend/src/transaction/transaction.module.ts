import { Module } from '@nestjs/common'
import { TransactionController } from '../transaction/transaction.controller'
import { TransactionService } from './transaction.service'
import { ApproveTransactionGateway } from '../transaction/approveTransaction.gateway'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '../auth/auth.guard'
import { UserService } from '../user/user.service'

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    UserService,
    ApproveTransactionGateway,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class TransactionModule {}
