import { Request, Response } from 'express'
import { User } from '../user/user.interface'
import { UserService } from './user.service'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'

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
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers()
  }
  async auth(req: Request, res: Response): Promise<void> {
    res.json(await this.userService.auth(req.body.username, req.body.password))
  }
}
