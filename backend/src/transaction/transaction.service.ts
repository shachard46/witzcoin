import { DataSource, MoreThan, Repository } from 'typeorm'
import { breakToBase2 } from '../utils'
import {
  Approver,
  Price,
  Transaction,
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
      logging: true,
      entities: [Transaction, User],
      synchronize: true,
    })
    await this.connection.initialize()
    this.repository = this.connection.getRepository(Transaction)
  }
  async createTransaction(
    trans: Transaction,
    issueing_username: string,
  ): Promise<Transaction> {
    const issueing_user =
      await this.userService.getUserByUsername(issueing_username)
    if (trans.buyerUser.pending + trans.buyerUser.balance - trans.price < 0) {
      return null
    }
    trans.status =
      Approver.ALL - (await this.getUserRoleInTransaction(trans, issueing_user))
    this.userService.changePendingByUsername(
      trans.buyerUser.username,
      trans.price,
      Price.EXPENSE,
    )
    this.userService.changePendingByUsername(
      trans.sellerUser.username,
      trans.price,
      Price.INCOME,
    )
    await this.repository.save(trans)
    return trans
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

  async updateTransactionStatus(
    id: number,
    user: User,
    decline: boolean = false,
  ): Promise<boolean> {
    if (decline) this.repository.delete(id)

    const role = await this.getUserRoleInTransaction(id, user)
    if (!role) return false

    const trans = await this.getTransactionById(id)
    if (trans.status == 0) return false
    trans.status -= role
    const result = await this.repository.update(id, trans)
    if (trans.status === 0)
      await this.userService.updateUsersOnceTransactionApproved(trans)
    return result.affected > 0
  }

  async getWaitingTransactionsByUser(user: User): Promise<Transaction[]> {
    return (await this.getTransactionsWaintingForApproval()).filter(
      trans => trans.buyerUser === user || trans.sellerUser === user,
    )
  }
  async getTransactionsByUser(username: string): Promise<Transaction[]> {
    const user = await this.userService.getUserByUsername(username)
    return (await this.getAllTransactions()).filter(
      trans => trans.buyerUser === user || trans.sellerUser === user,
    )
  }
}
