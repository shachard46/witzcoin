import { User } from '../user/user.interface'
import { UserService } from './user.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Role, Roles } from 'auth/auth.interfaces'

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async createUser(@Body() user: User): Promise<User> {
    const newUser: User = user
    return await this.userService.createUser(newUser)
  }
  @Get(':username')
  async getUserByUsername(
    @Param('usernanme') username: string,
  ): Promise<User | null> {
    return await this.userService.getUserByUsername(username)
  }
  @Roles([Role.ADMIN])
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers()
  }
}
