import { Request, Response } from 'express'
import { Transaction } from '../interfaces/transaction.interface'
import { TransactionService } from '../services/transaction.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { User } from '../interfaces/user.interface'

@Controller('/api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(@Body() trans: Transaction): Promise<Transaction> {
    const newTrans: Transaction = trans
    return await this.transactionService.createTransaction(trans)
  }
  @Get('waiting')
  async getTransactionsWaintingForApproval(): Promise<Transaction[]> {
    return await this.transactionService.getTransactionsWaintingForApproval()
  }
  @Get('waiting/:id')
  async getUsersWaitingByTransactionId(
    @Param('id') id: number,
  ): Promise<User[]> {
    return await this.transactionService.getUsersWaitingByTransactionId(id)
  }
  @Get(':id')
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<Transaction | null> {
    return await this.transactionService.getTransactionById(id)
  }
  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return await this.transactionService.getAllTransactions()
  }
}
