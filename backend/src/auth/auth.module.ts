import { Module } from '@nestjs/common'
import { UserModule } from 'user/user.module'
import { AuthController } from 'auth/auth.controller'
import { AuthService } from 'auth/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'backend-constants'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
