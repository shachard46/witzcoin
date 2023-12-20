import { Request, Response } from 'express'
import { Transaction } from '../models/transactionModel'
import { TransactionService } from '../services/transactionService'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { User } from '../models/userModel'

@Controller('/api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(@Body() trans: Transaction): Promise<Transaction> {
    const newTrans: Transaction = trans
    return await this.transactionService.createTransaction(trans)
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
}
