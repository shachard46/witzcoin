import { DataSource, Repository } from 'typeorm'
import { breakToBase2 } from '../utils'
import { Approver, Transaction } from '../transaction/transaction.interface'
import { User } from '../user/user.interface'
import { DB_NAME, DB_PASSWORD, DB_USERNAME, DB_PORT } from 'backend-constants'

export class TransactionService {
  connection: DataSource
  repository: Repository<Transaction>
  constructor() {
    this.initializeDatabaseConnection()
  }
  private async initializeDatabaseConnection(): Promise<void> {
    this.connection = new DataSource({
      type: 'mysql',
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
  async createTransaction(trans: Transaction): Promise<Transaction> {
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
        status: Approver.BUYER + Approver.SELLER + Approver.WITNESS,
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
    id: number,
    user: User,
  ): Promise<Approver | null> {
    const transaction = await this.getTransactionById(id)
    if (transaction?.buyerUser === user) return Approver.BUYER
    if (transaction?.sellerUser === user) return Approver.SELLER
    if (transaction?.witnessUser === user) return Approver.WITNESS
    return null
  }

  async updateTransactionStatus(id: number, user: User): Promise<boolean> {
    const role = this.getUserRoleInTransaction(id, user)
    if (!role) return false
    this.repository.update(id, { status: () => `status - ${role}` })
    return true
  }
}
