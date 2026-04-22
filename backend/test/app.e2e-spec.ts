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
  const user1 = new User(
    'shachar',
    'gg',
    30,
    0,
    Role.ADMIN,
    'shachar@witzcoin.local',
    'Shachar',
  )
  const user2 = new User(
    'genom',
    'gg',
    2,
    1,
    Role.ADMIN,
    'genom@witzcoin.local',
    'Genom',
  )
  const user3 = new User(
    'norman',
    'gg',
    12,
    4,
    Role.USER,
    'norman@witzcoin.local',
    'Norman',
  )
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

  it('/api/users (POST) registers by email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: `e2e-user-${Date.now()}@witzcoin.local`,
        fullName: 'E2E User',
        password: user1.password,
        role: user1.role,
      })
      .expect(200)

    expect(response.body.email).toMatch(/^e2e-user-\d+@witzcoin\.local$/)
    expect(response.body.fullName).toBe('E2E User')
    expect(response.body.username).toBeDefined()
    expect(response.body.role).toBe(user1.role)
  })

  afterAll(async () => {
    await app.close()
  })
})