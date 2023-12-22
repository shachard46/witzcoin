import { Body, Controller, Post } from '@nestjs/common'
import { AuthUserDto, User } from 'user/user.interface'
import { AuthService } from 'auth/auth.service'

@Controller('/api/login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signIn(@Body() user: AuthUserDto): Promise<any> {
    return await this.authService.signIn(user)
  }
}
