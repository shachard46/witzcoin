import { DataSource, Repository } from 'typeorm'
import { breakToBase2 } from '../../utils'
import { Approver, Transaction } from '../models/transactionModel'
import { User } from '../models/userModel'

export class TransactionService {
  connection: DataSource
  repository: Repository<Transaction>
  constructor() {
    this.connection = new DataSource({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test',
      synchronize: true,
      logging: true,
      entities: [Transaction],
    })
    this.repository = this.connection.getRepository(Transaction)
  }
  async createTransaction(trans: Transaction): Promise<Transaction> {
    await this.repository.save(trans)
    return trans
  }
  async getTransactionById(id: number): Promise<Transaction | null> {
    return await this.repository.findOne({ where: { id: id } })
  }

  async getAllTransnactions(): Promise<Transaction[]> {
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
    approver_codes.forEach(approver => {
      switch (approver) {
        case Approver.BUYER:
          approvers.push(trans.buyerUserName)
          break
        case Approver.SELLER:
          approvers.push(trans.sellerUserName)
          break
        case Approver.WITNESS:
          approvers.push(trans.witnessUserName)
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
    if (transaction?.buyerUserName === user) return Approver.BUYER
    if (transaction?.sellerUserName === user) return Approver.SELLER
    if (transaction?.witnessUserName === user) return Approver.WITNESS
    return null
  }

  async updateTransactionStatus(id: number, user: User): Promise<boolean> {
    const role = this.getUserRoleInTransaction(id, user)
    if (!role) return false
    this.repository.update(id, { status: () => `status - ${role}` })
    return true
  }
}
