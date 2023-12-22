import { Body, Controller, Post } from '@nestjs/common'
import { AuthUserDto, User } from 'user/user.interface'
import { AuthService } from 'auth/auth.service'
import { Public } from './auth.interfaces'

@Controller('/api/login')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Post()
  async signIn(@Body() user: AuthUserDto): Promise<any> {
    return await this.authService.signIn(user)
  }
}
