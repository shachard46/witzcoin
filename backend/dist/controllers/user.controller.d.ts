import { Request, Response } from 'express';
import { User } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUser(user: User): Promise<User>;
    getUserByUsername(username: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    auth(req: Request, res: Response): Promise<void>;
}
