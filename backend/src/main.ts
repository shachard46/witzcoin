import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Approver, Transaction } from 'transaction/transaction.interface'
import { Role } from 'auth/auth.interfaces'
import { User } from 'user/user.interface'
import { UserModule } from 'user/user.module'
import { UserService } from 'user/user.service'
import { TransactionService } from 'transaction/transaction.service'
import { log } from 'console'
import { AllExceptionsFilter } from 'exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useWebSocketAdapter(new IoAdapter(app))
  app.enableCors({
    origin: '*',
  })
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(3001)
  const user1: User = {
    username: 'shachar',
    password: 'gg',
    balance: 30,
    pending: 0,
    role: Role.ADMIN,
  }
  const user2: User = {
    username: 'genom',
    password: 'gg',
    balance: 2,
    pending: 0,
    role: Role.ADMIN,
  }
  const user3: User = {
    username: 'norman',
    password: 'gg',
    balance: 12,
    pending: 0,
    role: Role.USER,
  }
  const t1: Transaction = {
    transactionName: 'first',
    buyerUser: user1,
    sellerUser: user2,
    witnessUser: user3,
    details: 'd',
    price: 50,
    status: Approver.SELLER + Approver.WITNESS,
    category: 'games',
    id: 1,
  }
  const t2: Transaction = {
    transactionName: 'first',
    buyerUser: user2,
    sellerUser: user3,
    witnessUser: user1,
    details: 'd',
    price: 1,
    status: Approver.SELLER + Approver.WITNESS,
    category: 'games',
    id: 2,
  }
  const userService = new UserService()
  await userService.initializeDatabaseConnection()
  const transactionService = new TransactionService(userService)
  await transactionService.initializeDatabaseConnection()
  await userService.createUser(user1)
  await userService.createUser(user2)
  await userService.createUser(user3)
  await userService.createUser(user3)
  // await transactionService.createTransaction(t1, user1.username)
  // await transactionService.createTransaction(t2, user2.username)
  log(await transactionService.getAllTransactions())
  await transactionService.updateTransactionStatus(2, user3)
  await transactionService.updateTransactionStatus(2, user1)
  await transactionService.updateTransactionStatus(1, user2)
  await transactionService.updateTransactionStatus(1, user3)
}
bootstrap()
