import {
  OutTransaction,
  TransInvalidationUpdateDto,
  TransStatusUpdateDto,
  Transaction,
  TransactionCreationDto,
  toOutTransaction,
} from '../transaction/transaction.interface'
import { TransactionService } from './transaction.service'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common'
import { OutUser, User, toOutUser } from '../user/user.interface'
import { Public } from 'auth/auth.interfaces'
import { Category } from 'category/category.interface'
import { CategoryService } from 'category/caterory.service'
import { isCurrentUser } from 'auth/auth.service'

@Controller('/api/transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
  ) {}
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
    @Request() req,
  ) {
    isCurrentUser(statusUpdateDto.approvingUser.username, req)
    this.transactionService.updateTransactionStatusByAction(
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
  @Put('invalidate/:id')
  async invalidateTransaction(
    @Param('id') id: number,
    @Body() invalidateTransactionDto: TransInvalidationUpdateDto,
    @Request() req,
  ): Promise<void> {
    isCurrentUser(invalidateTransactionDto.user.username, req)
    return await this.transactionService.invalidateTransaction(
      invalidateTransactionDto.user,
      id,
    )
  }
  @Get('categories')
  async getAllCategories(): Promise<string[]> {
    return await this.categoryService.getAllCategories()
  }
}
