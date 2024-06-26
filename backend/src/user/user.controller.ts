import { OutUser, toOutUser, User } from '../user/user.interface'
import { UserService } from './user.service'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { Public, Role, ROLES, Roles } from '../auth/auth.interfaces'
import { Price } from 'transaction/transaction.interface'

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const newUser: User = user
    return await this.userService.createUser(newUser)
  }
  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<OutUser | null> {
    return toOutUser(await this.userService.getUserByUsername(username))
  }
  @Public()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers()
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
