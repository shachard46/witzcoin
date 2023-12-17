import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { UserService } from '../services/userService'

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    const newUser: User = req.body
    res.json(await this.userService.createUser(newUser))
  }

  async getUserByUsername(req: Request, res: Response): Promise<void> {
    res.json(await this.userService.getUserByUsername(req.params.username))
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    res.json(await this.userService.getAllUsers())
  }
  async auth(req: Request, res: Response): Promise<void> {
    res.json(await this.userService.auth(req.body.username, req.body.password))
  }
}
