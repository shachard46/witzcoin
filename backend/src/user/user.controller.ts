import { OutUser, toOutUser, User } from '../user/user.interface'
import { UserService } from './user.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Public, Role, Roles } from '../auth/auth.interfaces'

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
}
