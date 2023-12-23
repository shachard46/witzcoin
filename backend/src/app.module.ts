import { Module } from '@nestjs/common'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [TransactionModule, UserModule, AuthModule],
})
export class AppModule {}
