import { DataSource, LessThan, Repository } from 'typeorm'
import { breakToBase2 } from '../../utils'
import { Approver, Transaction } from '../models/transactionModel'
import { User } from '../models/userModel'

export class UserService {
  connection: DataSource
  repository: Repository<Transaction>
  constructor(username: string, password: string, balance: number = 0) {
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
    return this.repository.findOne({ where: { id: id } })
  }

  async getAllTransnactions(): Promise<Transaction[]> {
    return this.repository.find()
  }

  async getTransactionsWaintingForApproval(): Promise<Transaction[]> {
    return this.repository.find({
      where: {
        status: LessThan(Approver.BUYER + Approver.SELLER + Approver.WITNESS),
      },
    })
  }
  // TODO: define relations between transaction and users
  async getUsersWaitingByTransactionId(id: number): Promise<string[]> {
    const trans = await this.getTransactionById(id)
    if (!trans) {
      return []
    }
    const approvers: string[] = []
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
  async changeTransactionStatus(id: number): Promise<boolean> {
    return this.repository.exist({
      where: { username: username, password: password },
    })
  }
}
