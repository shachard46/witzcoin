import { Module } from '@nestjs/common'
import { UserController } from '../user/user.controller'
import { UserService } from './user.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'auth/auth.guard'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UserModule {}
