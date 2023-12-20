import { Module } from '@nestjs/common'
import { TransactionController } from '../controllers/transaction.controller'
import { TransactionService } from '../services/transaction.service'
import { ApproveTransactionGateway } from '../gateways/approveTransaction.gateway'

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, ApproveTransactionGateway],
})
export class TransactionModule {}
