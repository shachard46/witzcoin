import { Module } from '@nestjs/common'
import { TransactionController } from '../transaction/transaction.controller'
import { TransactionService } from './transaction.service'
import { ApproveTransactionGateway } from 'transaction/approveTransaction.gateway'

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, ApproveTransactionGateway],
})
export class TransactionModule {}
