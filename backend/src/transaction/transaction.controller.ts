import { Request, Response } from 'express'
import {
  OutTransaction,
  TransStatusUpdateDto,
  Transaction,
  TransactionCreationDto,
  toOutTransaction,
} from '../transaction/transaction.interface'
import { TransactionService } from './transaction.service'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { OutUser, User, toOutUser } from '../user/user.interface'
import { Public } from 'auth/auth.interfaces'

@Controller('/api/transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(
    @Body() transDto: TransactionCreationDto,
  ): Promise<Transaction> {
    const newTrans: OutTransaction = transDto.transaction
    return await this.transactionService.createTransaction(
      newTrans,
      transDto.issuingUsername,
    )
  }
  @Get('waiting')
  async getTransactionsWaintingForApproval(): Promise<OutTransaction[]> {
    return (
      await this.transactionService.getTransactionsWaintingForApproval()
    ).map(t => toOutTransaction(t))
  }
  @Put('waiting/:id')
  async updateTransactionStatus(
    @Param('id') id: number,
    @Body() statusUpdateDto: TransStatusUpdateDto,
  ) {
    this.transactionService.updateTransactionStatus(
      id,
      statusUpdateDto.approvingUser,
      statusUpdateDto.decline,
    )
  }
  @Get('waiting/:id')
  async getUsersWaitingByTransactionId(
    @Param('id') id: number,
  ): Promise<OutUser[]> {
    return (
      await this.transactionService.getUsersWaitingByTransactionId(id)
    ).map(user => toOutUser(user))
  }
  @Get(':id')
  async getTransactionById(
    @Param('id') id: number,
  ): Promise<OutTransaction | null> {
    return toOutTransaction(
      await this.transactionService.getTransactionById(id),
    )
  }
  @Get('user/:username')
  async getUsersTransactions(
    @Param('username') username: string,
  ): Promise<OutTransaction[] | null> {
    return (await this.transactionService.getTransactionsByUser(username)).map(
      t => toOutTransaction(t),
    )
  }
  @Get()
  async getAllTransactions(): Promise<OutTransaction[]> {
    return (await this.transactionService.getAllTransactions()).map(trans =>
      toOutTransaction(trans),
    )
  }
}
