import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { User } from '../src/user/user.interface'
import { Role } from '../src/auth/auth.interfaces'
import { Approver, Transaction } from '../src/transaction/transaction.interface'


describe('AppController (e2e)', () => {
  require('iconv-lite').encodingExists('foo')
  let app: INestApplication
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
    pending: 1,
    role: Role.ADMIN,
  }
  const user3: User = {
    username: 'norman',
    password: 'gg',
    balance: 12,
    pending: 4,
    role: Role.USER,
  }
  const t1: Transaction = {
    transactionName: 'first',
    buyerUser: user1,
    sellerUser: user2,
    witnessUser: user3,
    details: 'd',
    price: 5,
    status: Approver.SELLER + Approver.WITNESS,
    category: 'games',
    id: 0,
  }
  const t2: Transaction = {
    transactionName: 'first',
    buyerUser: user2,
    sellerUser: user3,
    witnessUser: user1,
    details: 'd',
    price: 3,
    status: Approver.SELLER + Approver.WITNESS,
    category: 'games',
    id: 1,
  }
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/api/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(user1)
      .expect(201) // Assuming you return status 201 for successful creation

    // Assuming your API returns the created user in the response body
    expect(response.body).toEqual(user1)
  })

  afterAll(async () => {
    await app.close()
  })
})