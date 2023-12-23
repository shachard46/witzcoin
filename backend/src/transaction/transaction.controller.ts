import { Request, Response } from 'express'
import {
  Transaction,
  TransactionCreationDto,
} from '../transaction/transaction.interface'
import { TransactionService } from './transaction.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { User } from '../user/user.interface'

@Controller('/api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(
    @Body() transDto: TransactionCreationDto,
  ): Promise<Transaction> {
    const newTrans: Transaction = transDto.transaction
    return await this.transactionService.createTransaction(
      newTrans,
      transDto.issuing_user,
    )
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
