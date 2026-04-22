import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import {
  OutUser,
  RegisterUserDto,
  toOutUser,
  UpdateProfileDto,
} from '../user/user.interface'
import { UserService } from './user.service'
import { Public, Role, Roles } from '../auth/auth.interfaces'
import { Price } from 'transaction/transaction.interface'

function usernameFromJwt(req: Request): string | undefined {
  const sub = (req as { user?: { access_token?: { sub?: unknown } } }).user
    ?.access_token?.sub
  if (typeof sub === 'object' && sub && 'username' in sub) {
    return (sub as { username: string }).username
  }
  return undefined
}

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: Request): Promise<OutUser | null> {
    const username = usernameFromJwt(req)
    if (!username) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.getUserByUsername(username)
    return user ? toOutUser(user) : null
  }

  @Patch('me')
  async patchMe(
    @Req() req: Request,
    @Body() body: UpdateProfileDto,
  ): Promise<OutUser> {
    const username = usernameFromJwt(req)
    if (!username) {
      throw new UnauthorizedException()
    }
    const updated = await this.userService.updateProfile(username, body)
    return toOutUser(updated)
  }

  @Public()
  @Post()
  async register(@Body() dto: RegisterUserDto): Promise<OutUser> {
    const created = await this.userService.registerWithEmail(dto)
    return toOutUser(created)
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<OutUser | null> {
    const user = await this.userService.getUserByUsername(username)
    return user ? toOutUser(user) : null
  }

  @Public()
  @Get()
  async getAllUsers(): Promise<OutUser[]> {
    const users = await this.userService.getAllUsers()
    return users.map(u => toOutUser(u))
  }

  @Roles([Role.ADMIN])
  @Put('balance/:username')
  async updateBalance(
    @Param('username') username: string,
    @Body() balance: { balance: number },
  ) {
    return await this.userService.changeBalanceByUsername(
      username,
      balance.balance,
      Price.INCOME,
      false,
      true,
    )
  }
}
