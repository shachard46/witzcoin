import { DataSource, MoreThan, Repository } from 'typeorm'
import { breakToBase2 } from '../utils'
import {
  Approver,
  OutTransaction,
  Price,
  UserWaitingTransactions,
} from '../transaction/transaction.interface'
import { User } from '../user/user.interface'
import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  DB_PORT,
} from '../backend-constants'
import { UserService } from '../user/user.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ValidationException } from 'exception.filter'
import { Transaction } from './transaction.interface'

const areUsersDistinct = (trans: Transaction): boolean => {
  const { buyerUser, sellerUser, witnessUser } = trans
  return (
    buyerUser.username !== sellerUser.username &&
    buyerUser.username !== witnessUser.username &&
    sellerUser.username !== witnessUser.username
  )
}

const userAlreadyApproved = (t: Transaction, role: Approver) => {
  if (t.status == Approver.ALL) return false
  if (t.status == Approver.NON) return true
  if (role == Approver.WITNESS && t.status >= 4) return false
  if (role == Approver.BUYER && t.status % 2 != 0) return false
  if (
    role == Approver.SELLER &&
    (t.status % 3 == 0 || t.status == Approver.SELLER)
  )
    return false
  return true
}

@Injectable()
export class TransactionService {
  connection: DataSource
  repository: Repository<Transaction>
  constructor(private userService: UserService) {
    this.initializeDatabaseConnection()
  }
  async initializeDatabaseConnection(): Promise<void> {
    this.connection = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      logging: false,
      entities: [Transaction, User],
      synchronize: true,
    })
    await this.connection.initialize()
    this.repository = this.connection.getRepository(Transaction)
  }
  async createTransactionUsers(trans: OutTransaction) {
    const buyerUser = await this.userService.getUserByUsername(trans.buyerUser)
    if (!buyerUser)
      throw new NotFoundException(`Buyer user not found: ${trans.buyerUser}`)

    const sellerUser = await this.userService.getUserByUsername(
      trans.sellerUser,
    )
    if (!sellerUser)
      throw new NotFoundException(`Seller user not found: ${trans.sellerUser}`)

    const witnessUser = await this.userService.getUserByUsername(
      trans.witnessUser,
    )
    if (!witnessUser)
      throw new NotFoundException(
        `Witness user not found: ${trans.witnessUser}`,
      )
    return new Transaction(
      trans.transactionName,
      buyerUser,
      sellerUser,
      witnessUser,
      trans.price,
      trans.category.toString(),
      trans.details,
      trans.status,
    )
  }
  async createTransaction(
    trans: OutTransaction,
    issueing_username: string,
  ): Promise<Transaction> {
    const issueing_user =
      await this.userService.getUserByUsername(issueing_username)
    console.log('balanceafter: ', issueing_user)

    const transaction = await this.createTransactionUsers(trans)

    if (
      transaction.buyerUser.pending +
        transaction.buyerUser.balance -
        trans.price <
      0
    ) {
      throw new ValidationException('buyer will be in debt')
    }
    if (!areUsersDistinct(transaction)) {
      throw new ValidationException('users need to be distinct')
    }
    transaction.status =
      Approver.ALL -
      (await this.getUserRoleInTransaction(transaction, issueing_user))
    this.userService.changePendingByUsername(
      transaction.buyerUser.username,
      transaction.price,
      Price.EXPENSE,
      false,
    )
    this.userService.changePendingByUsername(
      transaction.sellerUser.username,
      transaction.price,
      Price.INCOME,
      false,
    )
    await this.repository.save(transaction)
    return transaction
  }
  async getTransactionById(id: number): Promise<Transaction | null> {
    return await this.repository.findOne({ where: { id: id } })
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return await this.repository.find()
  }

  async getTransactionsWaintingForApproval(): Promise<Transaction[]> {
    return await this.repository.find({
      where: {
        status: MoreThan(Approver.NON),
      },
    })
  }
  // TODO: define relations between transaction and users
  async getUsersWaitingByTransactionId(id: number): Promise<User[]> {
    const trans = await this.getTransactionById(id)
    if (!trans) {
      return []
    }
    const approvers: User[] = []
    const approver_codes = breakToBase2(trans.status)
    console.log(approver_codes)
    approver_codes.forEach(approver => {
      switch (approver) {
        case Approver.BUYER:
          approvers.push(trans.buyerUser)
          break
        case Approver.SELLER:
          approvers.push(trans.sellerUser)
          break
        case Approver.WITNESS:
          approvers.push(trans.witnessUser)
          break
        default:
          break
      }
    })
    return approvers
  }

  async getUserRoleInTransaction(
    id: number | Transaction,
    user: User,
  ): Promise<Approver> {
    const transaction =
      typeof id === 'number' ? await this.getTransactionById(id) : id
    if (transaction?.buyerUser.username === user.username) return Approver.BUYER
    if (transaction?.sellerUser.username === user.username)
      return Approver.SELLER
    if (transaction?.witnessUser.username === user.username)
      return Approver.WITNESS
    return Approver.NON
  }
  async updateTransactionStatusByAction(
    id: string | number,
    user: User,
    decline: boolean = false,
  ) {
    id = typeof id === 'number' ? id : Number.parseInt(id)
    const trans = await this.getTransactionById(id)
    if (decline) {
      await this.userService.updateUsersOnceTransactionDone(trans, decline)
      return (await this.repository.delete(id)).affected > 0
    }
    const role = await this.getUserRoleInTransaction(id, user)
    if (!role) return false

    if (userAlreadyApproved(trans, role)) {
      throw new ValidationException('user already approved transaction')
    }
    if (trans.status == 0) return false
    this.updateTransactionStatus(trans, role)
    if (trans.status === 0)
      await this.userService.updateUsersOnceTransactionDone(trans, decline)
  }
  async updateTransactionStatus(
    trans: Transaction,
    role: Approver,
  ): Promise<boolean> {
    trans.status -= role
    const result = await this.repository.update(trans.id, trans)

    return result.affected > 0
  }

  async getWaitingTransactionsByUser(user: User): Promise<Transaction[]> {
    return (await this.getTransactionsWaintingForApproval()).filter(
      trans => trans.buyerUser === user || trans.sellerUser === user,
    )
  }
  async getTransactionsByUser(username: string): Promise<Transaction[]> {
    const user = await this.userService.getUserByUsername(username)
    if (!user) throw new ValidationException('user doesnt exists')
    return (await this.getAllTransactions()).filter(
      trans =>
        trans.buyerUser.username === username ||
        trans.sellerUser.username === username ||
        trans.witnessUser.username === username,
    )
  }

  async invalidateTransaction(user: User, id: number) {
    const transaction = await this.getTransactionById(id)
    if (!transaction) throw new ValidationException('transaction doesnt exists')
    if (user.username != transaction.witnessUser.username)
      throw new ValidationException('user is not the witness')
    await this.updateTransactionStatus(transaction, -Approver.WITNESS)
    this.userService.updateUsersOnceTransactionInvalidated(transaction)
  }
}
